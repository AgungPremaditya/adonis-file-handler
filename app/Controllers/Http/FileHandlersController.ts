import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Drive from '@ioc:Adonis/Core/Drive'
import { DateTime } from 'luxon'

export default class FileHandlersController {
  public async upload({ request, response }: HttpContextContract) {
    const file = request.file('file')

    if (!file) {
      return response.notFound()
    }

    const time = DateTime.now().toFormat("HH'H'mm'M'")

    await file.moveToDisk('images', {
      name: `File_${time}.${file.extname}`,
    })

    Drive.use('local')

    const url = await Drive.getUrl('images/')

    return `${url}File_${time}.${file.extname}`
  }

  public async show({ response, params }: HttpContextContract) {
    const filename = params.filename

    Drive.use('local')

    const url = await Drive.getStream(`images/${filename}`)

    response.stream(url)
  }
}

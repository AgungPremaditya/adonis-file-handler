import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'

import Drive from '@ioc:Adonis/Core/Drive'

export default class FileHandlersController {
  public async upload({ request, response }: HttpContextContract) {
    const file = request.file('file')

    if (!file) {
      return response.notFound()
    }

    const randString = string.generateRandom(5)

    await file.moveToDisk('images', {
      name: `File_${randString}.${file.extname}`,
    })

    Drive.use('local')

    const url = await Drive.getUrl('images/')

    return `${url}File_${randString}.${file.extname}`
  }

  public async show({ response, params }: HttpContextContract) {
    const filename = params.filename

    Drive.use('local')

    const url = await Drive.getStream(`images/${filename}`)

    response.stream(url)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const filename = params.filename
    const file = request.file('file')

    if (!file) {
      return response.notFound()
    }

    Drive.use('local')

    await Drive.delete(`images/${filename}`)

    const randString = string.generateRandom(5)

    await file.moveToDisk('images', {
      name: `File_${randString}.${file.extname}`,
    })

    const url = await Drive.getUrl('images/')

    return `${url}File_${randString}.${file.extname}`
  }
}

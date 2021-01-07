import User from 'App/Models/User'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class AuthController {

  public async register ({ request, response }: HttpContextContract) {
    const { username, email, password } = request.post()
    // console.log(email, password)
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      username: schema.string({ trim: true }, [ 
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.required(),
      ]),
    })

    try {
        const userDetails = await validator.validate({
            schema: validationSchema,
            data:{  username, email,   password  }
        })
        const user = new User()
        user.email = userDetails.email
        user.username = userDetails.username
        user.password = userDetails.password
        await user.save()
        return 'Your account has been created'
    }catch(error){
        console.log(error)
        return response.status(500).send('error, create failed!')
    } 
  }


  public async update ({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.post() 
    const user = await User.findBy('username', username)
    if(user){
      user.password = password 
      await user?.save()
      await auth.logout()
      return {msg:'ok'}
    }else{
      return response.status(404).send('error, user not found!')
    }
       
     
  }

  public async login ({  auth, view, response }: HttpContextContract) {
      const is_login = await auth.check() 
      if(is_login){
        return  response.redirect('/')
      } 
      return view.render('login')
  }

  public async auth ({ auth, request, response }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')
    await auth.attempt(username, password)
    response.redirect('/dashboard')
  }

  public async api_login ({ request, auth, response }: HttpContextContract) {
      const username = request.input('username')
      const password = request.input('password')
      try{
          const token = await auth.use('api').attempt(username, password)
          return token.toJSON()
      }catch(e){
        return response.status(401).send({msg:'auth failed!'})
      }
      
  }

}
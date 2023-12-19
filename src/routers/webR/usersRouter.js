import { Router } from 'express'
import { UsersManager } from '../../models/User.js'
import { soloLogueadosWeb } from '../../middlewares/sessions.js'
import { hashear } from '../../utils/cripto.js'

export const usersRouter = Router()

// registro

usersRouter.get('/register', function registerView(req, res) {
  res.render('register.handlebars', {
    pageTitle: 'Registro'
  })
})


usersRouter.post('/register', async function registrarUsuario(req, res) {
  try {
    
    req.body.password = hashear (req.body.password)
    await UsersManager.create(req.body)
    res.redirect('/login')
  } catch (error) {
    res.redirect('/register')
  }
})

usersRouter.get('/resetpassword', function resetPasswordView(req, res) {
  res.render('resetpassword.handlebars', {
    pageTitle: 'Reestablecer contraseña'
  })
})

usersRouter.post('/resetpassword', async function resetPassword(req, res) {
  try {

  
    req.body.password = hashear(req.body.password)

    const actualizado = await UsersManager.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    ).lean()

    if (!actualizado) {
      console.log('usuario no encontrado')
    } else {
      console.log(actualizado)
    }

    res.redirect('/login')
  } catch (error) {
    console.log(error)
    res.redirect('/resetpassword')
  }
})

// perfil

usersRouter.get('/profile', soloLogueadosWeb, function profileView(req, res) {
  res.render('profile.handlebars', {
    pageTitle: 'Perfil',
    user: req.session['user']
  })
})

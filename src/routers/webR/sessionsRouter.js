import { Router } from 'express';
import { UsersManager } from '../../models/User.js';

export const sessionsRouter = Router()


sessionsRouter.get('/login', function loginView(req, res) {
  res.render('login.handlebars', {
    pageTitle: 'Login'
  })
})

sessionsRouter.post('/login', async (req, res) => {
try {
  console.log(req.body);
    const { email, password } = req.body
    let datosUsuario;
  
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      datosUsuario = {
        email: 'admin',
        nombre: 'admin',
        apellido: 'admin',
        rol: 'admin'
      }
    } else {
      const usuario = await UsersManager.findOne({ email }).lean()
      console.log(usuario);
      if (!usuario || password !== usuario.password) {
        return res.status(400).json({ status: 'error', message: 'login failed' })
      }

      if (!hasheadasSonIguales(password, usuario.password)) {
        console.log('las contraseñas no coinciden')
        return res.redirect('/login')
      }
      
      datosUsuario = {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: 'usuario'
      }
    }
    req.session = req.session || {};
    req.session.user = datosUsuario;
    return res.status(201).json({ status: 'success', message:'login ok'})
    
    
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error })
  }
  
})
  
sessionsRouter.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'logout error', body: err });
    }
    res.json({ staus: 'success', message: 'logout ok'})
    
  });
});
/*
sessionsRouter.post('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login')
  })
})*/

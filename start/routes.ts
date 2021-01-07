/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ auth, response }) => {
  await auth.authenticate()
  return response.redirect('/dashboard')
})

Route.group(() => {
  Route.get('/logout', async ({ auth, response }) => {
      await auth.logout()
      return response.redirect('/login')
  })
  Route.on('/dashboard').render('home') 
  Route.on('/host').render('host') 
  Route.get('/hosts/detail/:id', 'HostsController.detail')
   
  Route.on('profile').render('profile')
}).middleware('auth')

 
Route.get('/login',   'AuthController.login')
Route.post('/login', 'AuthController.auth')
 
Route.post('/token', 'AuthController.api_login')

Route.get('/api/agent.json', async ({  response }) => {
   
  return response.send({'msg':'Method Not allowed!'})
})
Route.post('/api/agent.json', 'HostsController.get_data')
Route.post('register', 'AuthController.register') 

Route.group(() => {
 
  Route.get('/hosts', 'HostsController.list')
  Route.post('/hosts', 'HostsController.create')
  Route.get('/hosts/:id', 'HostsController.retrie')
  Route.delete('/hosts/:id', 'HostsController.delete')
  Route.get('/records/:id', 'RecordsController.list')
  Route.delete('/records/:id', 'RecordsController.delete')
  Route.post('/user/:id', 'AuthController.update')
}).prefix('/api').middleware('auth')

 
 
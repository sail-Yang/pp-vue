const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  model: state => state.user.model,
  email: state => state.user.email,
  password: state => state.user.password,
  visitNums: state => state.user.visitNums,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters

const users = []

export const addUser = (data) => {
  users.push(data)
}
export const authUser = (data) => {
  users.find((user) => user.id === data.id)
}
export const removeUser = (data) => {
  users.filter((user) => user.id !== data.id)
}
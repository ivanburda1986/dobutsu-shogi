//Add a server item
export async function addServerItem(newItem, cbSuccess, cbError) {
  const response = await firebase
    .database()
    .ref("snippets/" + newItem.id)
    .set(newItem, (error) => {
      if (error) {
        cbError();
      } else {
        cbSuccess();
      }
    });
  return response;
}

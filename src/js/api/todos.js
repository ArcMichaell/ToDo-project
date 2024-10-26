export async function getUserTodos(userId) {
    const url = `https://dummyjson.com/todos/user/${userId}`;
    try {
        if(!userId){return null}
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
       const data = response.json()
        return data
    }catch (error){
        console.error(`Ошибка при выполнении операции: ${error.message}`);
    }
    
}


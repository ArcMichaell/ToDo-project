export async function login(username, password) {
  const url = 'https://dummyjson.com/auth/login';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
        expiresInMins: 60,
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data) {
      localStorage.setItem("token",data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      return null;
    };
  } catch (error) {
    console.error(`Ошибка при выполнении операции: ${error.message}`);
    return null;
  };
};

export async function getUserDataByToken(token) {
  const url = 'https://dummyjson.com/auth/me';
  if(!token || token === 'null' || token === ''){return null}
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`Ошибка при выполнении операции: ${error.message}`);
    return null;
  }
}


// Todo Проверка и обновление токена

export async function checkTokenValidity(token) {
  const url = 'https://dummyjson.com/auth/me';
  try {
    if (!token || token === 'null' || token === '') { 
      return null;
     };

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      return true
    } else if (response.status === 401) {
      return null;
    };

  } catch (error) {
    console.log(`Ошибка при выполнении операции: ${error.message}`);
    return null;

  }
}

export async function updateToken() {
  const url = 'https://dummyjson.com/auth/refresh';
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken || refreshToken === 'null' || refreshToken === '') {
    console.log('Отсутствует refreshToken. Необходимо войти заново.');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return null;
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: refreshToken
      })
    });

    if(!response.ok){
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return null;
    }
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.accessToken)
      return data.accessToken;
    } else {
      
      console.log('Ошибка при обновлении токена:', response.status);
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при выполнении операции: ${error.message}`);
  }
}

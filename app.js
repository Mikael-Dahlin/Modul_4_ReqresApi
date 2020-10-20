// declaration of elements and api for later use
const loginFormEL = document.querySelector('#loginForm');
const showUsersButtonEL = document.querySelector('.showUsersButton');
const userlistEL = document.querySelector('.usersList');
const userInfoContainerEL = document.querySelector('.userInfoContainer');
const ErrorMessageEL = document.querySelector('#loginErrorMessage');
const apiUrl = "https://reqres.in/";

// add event listener to login form (Note!, it does not check if the password is correct, any value sent in the password field will be accepted)
loginFormEL.addEventListener('submit', (event) => {
    event.preventDefault();    
    fetch(apiUrl + 'api/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: loginFormEL['email'].value,
            password: loginFormEL['password'].value,
        })
    })
        .then((res) => res.json())
        .then((jsonData) => {
            if(jsonData.error){
                ErrorMessageEL.innerHTML = jsonData.error;
                showUsersButtonEL.classList.add('hide');
                userlistEL.innerHTML = "";
                userInfoContainerEL.innerHTML = "";
                ErrorMessageEL.classList.remove('hide');
            }
            else{
                ErrorMessageEL.classList.add('hide');
                showUsersButtonEL.classList.remove('hide');
            }
        });
});

// add event listener to the show users button (remove page 2?)
showUsersButtonEL.addEventListener('click', (event) => {
    fetch(apiUrl + 'api/users').then((res)=>res.json()).then((data)=>{
        const users = data.data;
        const usersString = users.map((user)=>{
            return `<li class="user" data-userid=${user.id}>${user.first_name}</li>`;
        }).join('');
        userlistEL.innerHTML = usersString;
    });
});

// add event listener to the user list, prints out the users info in the user container.
userlistEL.addEventListener('click', (event)=>{
    const userId = event.target.dataset.userid;
    fetch(`${apiUrl}api/users/${userId}`)
        .then((res) => res.json())
        .then((jsonData) => {
            userInfoContainerEL.innerHTML = "";
            const user = jsonData.data;

            const name = document.createElement('p');
            name.innerText = `${user.first_name} ${user.last_name}`;
            
            const avatarImg = document.createElement('img');
            avatarImg.src = user.avatar;

            const email = document.createElement('p');
            email.innerText = user.email;
            userInfoContainerEL.append(name, avatarImg, email);
    });
});

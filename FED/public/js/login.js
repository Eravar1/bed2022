/*

inspiration: 
https://dribbble.com/shots/2292415-Daily-UI-001-Day-001-Sign-Up

*/

let form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  return false;
});

$("#login").click(()=>{
    var username = $("#emailLogin").val();
    var password = $("#passwordLogin").val();
    console.log(username, password)
    login(username, password);
})

function login(username, password){
    axios.post('http://localhost:8081/login', {
        username: username,
        password: password
    }).then((res)=>{
        console.log(res)
        if(res.status == 200){
            localStorage.setItem("token", res.data.token)
            window.location.assign("/index.html");
        }else{
            alert("Login Failed");
        }
    })
}
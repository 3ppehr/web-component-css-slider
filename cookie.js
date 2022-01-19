import { baseElement } from "../base-element.js";

customElements.define('cookie', class extends baseElement {
    connectedCallback() {
        super.connectedCallback();
        const setCookieButton = this.shadowRoot.querySelector("#setCookie");
        const cookieBody = this.shadowRoot.querySelector("#cookieBody");
        setCookieButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem('acceptCookie', true)
            cookieBody.style.display = "none";
        });
        const clearCookieButton = this.shadowRoot.querySelector("#clearCookie");
        clearCookieButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem('acceptCookie', false)
            console.log(localStorage.getItem('acceptCookie'))
            cookieBody.style.display = "none";
        });
        if (localStorage.getItem('acceptCookie') === null || localStorage.getItem('acceptCookie') === "false") {
            cookieBody.style.display = "block";
        } else {
            cookieBody.style.display = "none";
        }
    }
    render = () => /*html*/`
    <style>
    div{
        padding:1rem;
        background:black;
        color:var(--white);
        font-weight:bold;
        direction: ltr;
        position:fixed;
        bottom:0;
        left:0;
        right:0;
        z-index: 100;
        text-align:center
    }
    button{
        background: var(--base-hover-color);
        color:black;
        padding:.5rem 2rem;
        transition:all .2s;
        font-weight:bold
    }
    button:focus{
        background:var(--orange);
        color:var(--white);
    }
    </style>
<div id="cookieBody">
<p>
Our Privacy Policy explains our principles when it comes to the collection, processing, and storage of your information. This policy specifically explains how we, our partners, and users of our services deploy cookies, as well as the options you have to control them.
<p>
<button type="button" id="setCookie">Accept </button>
<button type="button" id="clearCookie">Decline </button>
</div>


`



})
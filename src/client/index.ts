import { init } from "./main";

const btn = document.getElementById('login-btn');

if (btn) {
    btn.addEventListener("click", async function (e) {
        const name = (document.getElementById('login-text') as HTMLInputElement).value;

        console.log('login', { name });

        if (name) {
            const response = await window.fetch('login', {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                const json = await response.json();
                console.log('Logged in, starting application', json);
                (window as any).game = { app: null, state: { name } };
                start();
            }
        }

        e.preventDefault();
    });
}

function start() {
    document.getElementById('login-container')?.remove();

    const app = init();

    window.addEventListener('resize', function () {
        app.scale.resize(window.innerWidth, window.innerHeight);
    }, false);

    (window as any).game.app = app;
}
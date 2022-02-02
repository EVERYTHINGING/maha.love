import { createApp } from 'vue'
import App from './App.vue'

window.treeData = [
    { name: "hello" },
    { name: "wat" },
    {
        name: "drawings",
        children: [
            {
                name: "from college",
                children: [{ name: "hello" }, { name: "wat" }]
            },
            { name: "hello" },
            { name: "wat" },
            {
                name: "child folder",
                children: [{ name: "hello" }, { name: "wat" }]
            }
        ]
    }
];

createApp(App).mount('#app')

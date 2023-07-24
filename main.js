var app = new Vue({
    el: "#app",
    data: {
        product: "Socks",
        description: "this soocks is one the best in the world",
        image: './assets/image_1.jpg',
        link: "https://www.google.com/",
        inventory: 100,
        inSale: false,   // CHALLENGE PROPERTY
        sizes: ["small", "medium", "big"],
        card: 5,
    },
    methods: {
        decCard() {
            this.card -= 1;
        }
    }
})
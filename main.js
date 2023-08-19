var eventBus = new Vue()
Vue.component("moreDetail", {
  props: {
    productDetails: {
      type: Array,
      require: true,
    }
  },
  template:
    `
    <ul>
      <li v-for="detail in productDetails" >{{detail}}</li>
    </ul>
        `,
})

Vue.component("product_review", {
  template:
    `
    <form class="review-form" @submit.prevent="onSubmit">
    <div class="validation" v-if="errors.length">
      <p>please fill this inputs :</p>
      <ul>
        <li v-for="error in errors">{{error}}</li>
      </ul>
    </div>
  
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name" />
    </p>
  
    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>
  
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p class="recommend_part" >
    Would you recommend this product ?  
    <br>
    <input  v-model="checked" type="radio" id="yess_btn" name="fav_language" value="yes" />  
    <label for="yess_btn">YES</label><br />
      <input  v-model="checked" type="radio" id="no_btn" name="fav_language" value="no" />  
    <label for="no_btn">NO</label><br />
  </p>
  
    <p>
      <button>Submit</button>
    </p>
  </form>
  
    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      checked: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      if (this.name && this.review && this.rating && this.checked) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          checked: this.checked,
        }
        eventBus.$emit("review_submitted", productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.checked = null
      }
      else {
        if (!this.name) this.errors.push("*Name required")
        if (!this.review) this.errors.push("*Review required")
        if (!this.rating) this.errors.push("*Rating required")
        if (!this.checked) this.errors.push("*Recommend required")
      }
    }
  }
})

Vue.component("product_tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template:
    `
<div>
  <span class="tab tab_links " :class="{activeTab: selectedTab === tab}"
  v-for="(tab , index) in tabs" :key="index" @click="selectedTab = tab" >{{tab}}</span>

  <div class="review_parent" v-show="selectedTab === 'Reviews'" >
  <h2>Reviews</h2>
  <p v-if="!reviews.length">There are no reviews yet.</p>
  <ul>
  <li v-for="review in reviews">
  <p>name:{{ review.name }}</p>
  <p>Rating: {{ review.rating }}</p>
  <p>review:{{ review.review }}</p>
  <p>recommend:{{ review.checked }}</p>
  </li>
  </ul>
  </div>
  <product_review v-show="selectedTab === 'Make a Review'" ></product_review>
</div>
        `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: "Reviews"
    }
  }
})

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `  
  <div class="product">
  <div class="first_part_product">
    <div class="product_image">
      <a v-bind:title="product" v-bind:href="link">
        <img v-bind:src="image" v-bind:alt="product" />
      </a>
    </div>
    <div class="product_info">
      <a v-bind:title="product" v-bind:href="link">
        <h1>{{ title }}</h1>
        <p>Shipping: {{ shipping }}</p>
      </a>
      <p>{{ description }}</p>
      <ul>
        <li v-for="size in sizes" :key="size.sizeNumber">{{size}}</li>
      </ul>
      <p v-if="inStock">On Sale!</p>
      <p v-else-if="inStock">Almist sold out!</p>
      <p :class="[isActive ? activeClass : '']" v-else>Out of stock</p>
      <p>{{sale}}</p>
      <moreDetail :productDetails="productDetails"></moreDetail>
      <div class="tools">
        <span class="colors">chosse the color :</span>
        <div class="color_box">
          <button
            v-for="(variant, index) in variants"
            :key="variant.variantNum"
            :style="{ backgroundColor: variant.variantsColor }"
            @click="changeColor(index)"
          ></button>
        </div>
        <button :disabled="!inStock" v-on:click="decCard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m21.41 11.58l-9-9C12.04 2.21 11.53 2 11 2H4a2 2 0 0 0-2 2v7c0 .53.21 1.04.59 1.41l.41.4c.9-.54 1.94-.81 3-.81a6 6 0 0 1 6 6c0 1.06-.28 2.09-.82 3l.4.4c.37.38.89.6 1.42.6c.53 0 1.04-.21 1.41-.59l7-7c.38-.37.59-.88.59-1.41c0-.53-.21-1.04-.59-1.42M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7M10 19H2v-2h8v2Z"
            />
          </svg>
        </button>
        <button :disabled="!inStock" v-on:click="incCard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m21.41 11.58l-9-9C12.04 2.21 11.53 2 11 2H4a2 2 0 0 0-2 2v7c0 .53.21 1.04.59 1.41l.41.4c.9-.54 1.94-.81 3-.81a6 6 0 0 1 6 6c0 1.06-.28 2.09-.82 3l.4.4c.37.38.89.6 1.42.6c.53 0 1.04-.21 1.41-.59l7-7c.38-.37.59-.88.59-1.41c0-.53-.21-1.04-.59-1.42M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7M10 19H7v3H5v-3H2v-2h3v-3h2v3h3v2Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <product_tabs :reviews="reviews" ></product_tabs>
  
</div>
`,
  data() {
    return {
      brand: "brandName",
      product: "Socks",
      productDetails: ["Quality : best", "Material : cotton", "Size : small"],
      description: "this soocks is one the best in the world",
      link: "https://www.google.com/",
      selectedVariant: 0,
      sizes: ["small", "medium", "big"],
      isActive: true,
      activeClass: "active",
      variants: [
        {
          variantNum: "1",
          variantsColor: 'green',
          variantImage: "./assets/image_1.jpg",
          variantQuantity: 10,
          onSale: true,

        }, {
          variantNum: "2",
          variantsColor: 'blue',
          variantImage: "./assets/image_2.jpg",
          variantQuantity: 0,
          onSale: false,
        },
      ],
      reviews: []
    }
  },
  methods: {
    incCard() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    decCard() {
      this.$emit('remove-cart', this.variants[this.selectedVariant].variantId)
    },
    changeColor(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale() {
      if (this.variants[this.selectedVariant].onSale) {
        return this.brand + " " + this.product + " are available"
      }
      return this.brand + " " + this.product + " are not available"
    },
    shipping() {
      if (this.premium) {
        return "Free"
      } else {
        return 2.99
      }
    }
  },
  mounted() {
    eventBus.$on('review_submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCartAdd(id) {
      this.cart.push(id)
    },
    updateCartRemove(id) {
      this.cart.pop(id)
    }
  }
})
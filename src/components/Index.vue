<template>
    <v-main class="mainV">
        <v-app-bar hide-on-scroll app height="100px" color="blue darken-4" dark>
            <v-toolbar-title class="custom2--text">
                <v-row>
                    <v-col>
                        <img src="@/assets/logoAJR.png" height="75px">
                    </v-col>
                    <v-col class="mr-8 mt-1">
                        <v-row><strong class="white--text custom2--text">ATMA</strong></v-row>
                        <v-row><strong class="white--text custom2--text">JOGJA</strong></v-row>
                        <v-row><strong class="white--text custom2--text">RENTAL</strong></v-row>
                    </v-col>
                </v-row>
            </v-toolbar-title>
            <VSpacer/>
            <v-toolbar-items>
                <v-btn color="deep-orange lighten-5" @click="login" text router><b>LOGIN</b></v-btn>
                <v-btn color="deep-orange lighten-5" @click="register" text router><b>REGISTER</b></v-btn>
            </v-toolbar-items>
        </v-app-bar>
        
        <v-carousel height="700px">
            <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src" reverse-transition="fade-transition" transition="fade-transition"></v-carousel-item>
        </v-carousel>
        
        <v-container class="mt-8 mb-4">
            <h1 class="custom1--text" color="red--text">ATMA JOGJA RENTAL
                <br>- RENTAL AND TOUR SERVICES -
            </h1>
            <h4 class="mt-6 custom2--text">
                Atma Jogja Rental (AJR) adalah sebuah badan usaha yang menyediakan jasa penyewaan kendaraan mobil yang berada
                <br> di Kota Yogyakarta. Atma Jogja Rental menyediakan mobil dengan berbagai merk yang ada di Indonesia. Selain menyewakan
                <br> mobil, Atma Jogja Rental juga menyediakan jasa driver untuk mengantar customer selama menyewa mobil di Yogyakarta.

            </h4>
        </v-container>
        <v-divider></v-divider>
        <v-container class="mb-6">
            <h1 class="custom1--text mb-5 mt-5">OUR LOCATION</h1>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.098178319957!2d110.41394041406102!3d-7.7794141793385245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1650787874546!5m2!1sid!2sid" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </v-container>
        <v-divider></v-divider>

        <h1 class="custom1--text mt-8 mb-4">WHY ATMA JOGJA RENTAL ?</h1>
        <div class="row mb-8">
            <div class="col">
                <span class="dot">
                    <img src="@/assets/benefit1.png" alt="Easy To Use" height="115px">
                </span>
                <h4 class="custom2--text">
                        Anda dapat menyewa mobil beserta driver dengan mudah dimana saja dan kapan saja dengan aplikasi kami
                </h4>
            </div>
            <div class="col">
                <span class="dot">
                    <img src="@/assets/benefit2.png" alt="Low Price" height="115px">
                </span>
                <h4 class="custom2--text">
                    AJR menawarkan pilihan penyewaan mobil dan driver termurah sesuai dana pelanggan
                </h4>
            </div>
            <div class="col">
                <span class="dot">
                    <img src="@/assets/benefit3.png" alt="Car List" height="115px">
                </span>
                <h4 class="custom2--text">
                    Pelanggan dapat memilih berbagai pilihan kendaraan dan driver yang ditawarkan sehingga memenuhi kepuasan pelanggan
                </h4>
            </div>
            <div class="col">
                <span class="dot">
                    <img src="@/assets/benefit4.png" alt="Right Choices" height="115px">
                </span>
                <h4 class="custom2--text">
                    AJR menjamin kenyamanan pelanggan dengan memberikan informasi lengkap mengenai mobil dan driver yang disewakan
                </h4>
            </div>
        </div>
        <v-divider></v-divider>

        <h1 class="custom1--text mt-8">THE DEVELOPER</h1>
        <div class="text-center mt-4 mb-8">
            <v-bottom-sheet v-model="sheet" persistent >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="blue darken-4" dark v-bind="attrs" v-on="on"> Click Me </v-btn>
                </template>
                <v-sheet class="text-center" width="100%" height="250px">
                    <v-btn class="mt-6" text color="error" @click="sheet = !sheet"> close </v-btn>
                    <div class="py-3 row">
                        <div class="col">
                            <v-avatar class="customAvatar">
                                <img src="@/assets/teamVicky.jpg" alt="Vicky" >
                            </v-avatar>
                            <h3 class="custom1--text">Vicky Valerian Sende</h3>
                            <h3 class="custom1--text">190710079</h3>
                        </div>
                    </div>
                </v-sheet>
            </v-bottom-sheet>
        </div>

        <v-footer padless height="75px">
            <v-col class="text-center" cols="12">
                <strong>Proyek Pengembangan Perangkat Lunak G</strong>
            </v-col>
        </v-footer>
    </v-main>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Sansita:wght@700&family=Satisfy&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

    .mainV{
        padding: 0 !important;
    }

    .custom1--text{
        font-family: Satisfy;
    }
    
    .custom2--text{
        font-family: Sansita;
    }

    .customAvatar{
        height: 100px !important;
        width: 100px !important;
    }

    .dot {
        height: 150px;
        width: 150px;
        background-color: #2196F3;
        border-radius: 50%;
        display: flex;
        align-items:center;
        justify-content:center;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 16px;
    }
</style>

<script>
export default {
    data () {
      return {
        sheet: false,
         items: [
           { src: require('../assets/picture1.jpg'), },
           { src: require('../assets/picture2.jpg'), },
           { src: require('../assets/picture3.jpg'), },
         ],
      }
    },
    methods: {
        login(){
            this.$router.push({
                name: 'Login',
            });
        },
        register(){
            this.$router.push({
                name: 'Register',
            });
        }
    }
}
</script>
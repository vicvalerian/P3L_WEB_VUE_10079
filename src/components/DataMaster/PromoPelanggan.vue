<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Daftar Promo</h1>

        <div class="container">
            <v-card class="mt-6 kartuKupon" width="300" v-for="(item, index) in promos" :key="index">
                <div class="row">
                    <v-card-title class="custom2--text"> {{ item.jenis_promo }} </v-card-title>
                </div>
                <div class="row">
                    <v-card-subtitle> {{ item.keterangan_promo }} </v-card-subtitle>
                </div>
                <div class="row">
                    <v-card-subtitle><b>Kode Promo:</b></v-card-subtitle>
                    <v-card-subtitle class="kodePromo"><b> {{ item.kode_promo }} </b></v-card-subtitle>
                </div>

                <v-card-actions>
                    <v-chip v-if="item.status_promo === 'Aktif'" text-color="white" color="green">
                        <v-icon left>mdi-check</v-icon>
                        {{ item.status_promo }}
                    </v-chip>
                    <v-chip v-if="item.status_promo === 'Tidak Aktif'" text-color="white" color="red">
                        <v-icon left>mdi-close</v-icon>
                        {{ item.status_promo }}
                    </v-chip>
                </v-card-actions>
            </v-card>
        </div>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data(){
        return{
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            promos: [],
        };
    },
    methods: {
        //Read Data Promo
        readData() {
            var url = this.$api + '/promo';
            this.$http.get(url).then((response) => {
                this.promos = response.data.data;
            });
        },
    },
    mounted(){
        this.readData();
    },
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Orelega+One&family=Sansita:wght@700&family=Satisfy&display=swap');

    .custom1--text{
        font-family: 'Orelega One', cursive;
        font-size: 52px;
    }

    .custom2--text{
        font-size: 24px;
    }

    .kartuKupon{
        padding: 10px;
    }

    .container{
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .kodePromo{
        color: orangered;
        font-size: 24px;
    }
</style>
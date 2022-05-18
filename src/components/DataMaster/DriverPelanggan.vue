<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Brosur Driver</h1>

        <div class="container">
            <v-card class="mx-auto my-12" max-width="350" v-for="(item, index) in drivers" :key="index">
                <v-img width="350px" height="400px"
                        :src="previewImageUrl == '' ? $baseUrl+'/storage/'+item.foto_driver : previewImageUrl" id="previewImage"></v-img>
                <v-card-title>
                    {{ item.id_driver }}
                    <v-spacer></v-spacer>
                    <v-rating :value="item.rating_driver" color="amber" dense half-increments readonly size="18"></v-rating>
                </v-card-title>
                <v-card-title class="mt-n8">{{ item.nama_driver }}</v-card-title>

                <v-divider class="mx-4"></v-divider>
                <v-card-text>
                    <div class="my-4 text-subtitle-1"><b>Bahasa yang digunakan</b></div>
                    <div><b>{{ item.bahasa_driver }}</b></div>
                </v-card-text>

                <v-card-actions>
                    <v-chip v-if="item.status_driver === 'Tersedia'" text-color="white" color="green">
                        <v-icon left>mdi-check</v-icon>
                        {{ item.status_driver }}
                    </v-chip>
                    <v-chip v-if="item.status_driver === 'Tidak Tersedia'" text-color="white" color="red">
                        <v-icon left>mdi-close</v-icon>
                        {{ item.status_driver }}
                    </v-chip>
                    <v-chip class="ma-2" text-color="white" color="primary">
                        <v-icon left>mdi-currency-usd</v-icon>
                        {{ item.sewa_harian_driver }}/hari
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
            show: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            drivers: [],
            previewImageUrl: '',
        };
    },
    methods: {
        onPreviewImage(e) {
            this.previewImageUrl = URL.createObjectURL(e);
        },

        //Read Data Driver
        readData() {
            var url = this.$api + '/driver';
            this.$http.get(url).then((response) => {
                this.drivers = response.data.data;
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

    .container{
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-around;
        flex-wrap: wrap;
    }
</style>
<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Brosur Mobil</h1>

            <div class="container">
                <v-card class="mb-12 mr-4" v-for="(item, index) in mobils" :key="index">
                    <v-img width="350px"
                        :src="previewImageUrl == '' ? $baseUrl+'/storage/'+item.foto_mobil : previewImageUrl" id="previewImage"></v-img>
                    <v-card-title class="custom2--text">{{ item.nama_mobil }}</v-card-title>
                    <v-card-subtitle class="custom2--text">{{ item.plat_mobil }}</v-card-subtitle>
                    <v-divider></v-divider>
                    <v-card-title class="custom2--text mb-n9">Tipe Mobil: {{ item.tipe_mobil }}</v-card-title>
                    <v-card-title class="custom2--text mb-n9">Jenis Transmisi: {{ item.jenis_transmisi }}</v-card-title>
                    <v-card-title class="custom2--text mb-n9">Jenis Bahan Bakar: {{ item.jenis_bahan_bakar }}</v-card-title>
                    <v-card-title class="custom2--text mb-n9">Warna Mobil: {{ item.warna_mobil }}</v-card-title>
                    <v-card-title class="custom2--text mb-n9">Volume Bagasi: {{ item.volume_bagasi }}</v-card-title>
                    <v-card-title class="custom2--text">Fasilitas Mobil: {{ item.fasilitas_mobil }}</v-card-title>

                    <v-card-actions>
                        <v-chip v-if="item.status_mobil === 'Tersedia'" text-color="white" color="green">
                            <v-icon left>mdi-check</v-icon>
                            {{ item.status_mobil }}
                        </v-chip>
                        <v-chip v-if="item.status_mobil === 'Tidak Tersedia'" text-color="white" color="red">
                            <v-icon left>mdi-close</v-icon>
                            {{ item.status_mobil }}
                        </v-chip>
                        <v-chip class="ma-2" text-color="white" color="primary">
                            <v-icon left>mdi-currency-usd</v-icon>
                            {{ item.sewa_harian_mobil }}/hari
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
            show: false,
            error_message: '',
            color: '',
            mobils: [],
            previewImageUrl : '',
        };
    },
    methods: {
        onPreviewImage(e) {
            this.previewImageUrl = URL.createObjectURL(e)
        },

        //Read Data Mobil
        readDataMobil() {
            var url = this.$api + '/mobil';
            this.$http.get(url).then((response) => {
                this.mobils = response.data.data;
            });
        },
    },
    mounted(){
        this.readDataMobil();
    },
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Orelega+One&family=Sansita:wght@700&family=Satisfy&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@500&display=swap');

    .custom1--text{
        font-family: 'Orelega One', cursive;
        font-size: 52px;
    }

    .custom2--text{
        font-family: 'Orelega One', cursive;
        font-size: 20px;
    }

    .container{
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-around;
        flex-wrap: wrap;
    }
</style>
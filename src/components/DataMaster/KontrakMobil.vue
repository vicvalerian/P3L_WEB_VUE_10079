<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Kontrak Mobil Kurang Dari 1 Bulan</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>

            <v-data-table :headers="headers" :items="kontrakMobils" :search="search"></v-data-table>
        </v-card>

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
            headers: [
                { text: "Plat Mobil", align: "start", sortable: true, value: "plat_mobil", },
                { text: "Nama Mobil", value: "nama_mobil", },
                { text: "Nomor KTP Pemilik", value: "no_ktp_pemilik", },
                { text: "Nama Pemilik", value: "nama_pemilik" },
                { text: "Tanggal Kontrak Berakhir", value: "periode_kontrak_akhir" },
            ],
            kontrakMobils: [],
        };
    },
    methods: {
        //Read Data Pemilik
        readData() {
            var url = this.$api + '/kontrakMobil';
            this.$http.get(url).then((response) => {
                this.kontrakMobils = response.data.data;
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
</style>
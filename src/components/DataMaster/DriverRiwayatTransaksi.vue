<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Riwayat Transaksi Driver</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>

            <v-data-table :headers="headers" :items="drivers" :search="search">
                <template v-slot:[`item.foto`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.foto_driver" height="50px" width="50px" style="object-fit:cover; border-radius:50%; padding: 25px 0;"/>
                </template>
                <template v-slot:[`item.rating_driver_transaksi`]="{ item }">
                    <v-rating v-model="item.rating_driver_transaksi" background-color="orange lighten-3" color="orange" label="Rating Driver" medium readonly></v-rating>
                </template>
            </v-data-table>
        </v-card>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data(){
        return{
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            headers: [
                { text: "ID Driver", align: "start", sortable: true, value: "id_driver", },
                { text: "Nama", value: "nama_driver" },
                { text: "Jenis Kelamin", value: "jenis_kelamin_driver" },
                { text: "Nomor Telepon", value: "notelp_driver" },
                { text: "Email", value: "email_driver" },
                { text: "Transaksi", value: "id_detail_transaksi" },
                { text: "Foto", value: "foto" },
                { text: "Rating", value: "rating_driver_transaksi" },
            ],
            driver: new FormData(),
            drivers: [],
            detailTransaksis: [],
        };
    },
    methods: {
        //Read Data Driver
        readData() {
            var url = this.$api + '/transaksiDriver';
            this.$http.get(url).then((response) => {
                this.drivers = response.data.data;
            });
        },

        // //Read Data Detail Transaksi
        // readDataDetailTransaksi() {
        //     var url = this.$api + '/detailTransaksi';
        //     this.$http.get(url).then((response) => {
        //         this.detailTransaksis = response.data.data;
        //     });
        // },
    },
    mounted(){
        this.readData();
        this.readDataDetailTransaksi();
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
<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Transaksi</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>

            <v-data-table :headers="headers" :items="transaksis" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                    <v-icon dense color="red" @click="deleteHandler(item.id_transaksi)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Update Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.id_pelanggan" disabled label="Id Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.id_pegawai" disabled label="Id Pegawai" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_transaksi" disabled label="Tanggal Transaksi" required></v-text-field>
                        <v-select v-model="form.metode_pembayaran" label="Metode Pembayaran" :items="metode" required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="update"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>Anda Yakin ingin menghapus transaksi ini?</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Id Transaksi", align: "start", sortable: true, value: "id_transaksi", },
                { text: "Pelanggan", value: "nama_pelanggan" },
                { text: "Pegawai", value: "nama_pegawai" },
                { text: "Promo", value: "kode_promo" },
                { text: "Tanggal Transaksi", value: "tgl_transaksi" },
                { text: "Metode Pembayaran", value: "metode_pembayaran" },
                { text: "Action", value: "actions" },
            ],
            transaksi: new FormData(),
            transaksis: [],
            pelanggans: [],
            promos: [],
            pegawais: [],
            form: {
                id_pelanggan: '',
                id_promo: '',
                id_pegawai: localStorage.getItem('id_pegawai'),
                tgl_transaksi: '',
                metode_pembayaran: '',
            },
            deleteId: '',
            editId: '',
            metode: [ 'Tunai', 'Non Tunai' ],
        };
    },
    methods: {
        //Read Data Transaksi
        readDataTransaksi() {
            var url = this.$api + '/transaksi';
            this.$http.get(url).then((response) => {
                this.transaksis = response.data.data;
            });
        },

        //Read Data Pelanggan
        readDataPelanggan() {
            var url = this.$api + '/pelanggan';
            this.$http.get(url).then((response) => {
                this.pelanggans = response.data.data;
            });
        },

        //Read Data Promo
        readDataPromo() {
            var url = this.$api + '/promo';
            this.$http.get(url).then((response) => {
                this.promos = response.data.data;
            });
        },

        //Read Data Pegawai
        readDataPegawai() {
            var url = this.$api + '/pegawai';
            this.$http.get(url).then((response) => {
                this.pegawais = response.data.data;
            });
        },

        //Update Data Transaksi
        update(){
            var data = new FormData();

            data.append('id_pelanggan', this.form.id_pelanggan);
            data.append('id_pegawai', this.form.id_pegawai);
            data.append('tgl_transaksi', this.form.tgl_transaksi);
            data.append('metode_pembayaran', this.form.metode_pembayaran);

            var url = this.$api + '/transaksi/' + this.editId;
            this.load = true;
            this.$http.post(url, data, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                this.error_message = response.data.message;
                this.color = 'green';
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readDataTransaksi();
                this.readDataPelanggan();
                this.readDataPromo();
                this.readDataPegawai();
                this.resetForm();
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        //Delete Data Mobil
        deleteData(){
            var url = this.$api + "/transaksi/" + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = true;
            this.close();
            this.readDataTransaksi();
            this.readDataPelanggan();
            this.readDataPromo();
            this.readDataPegawai();
            this.resetForm();
            this.inputType = "Tambah";
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_transaksi;
            this.form.id_pelanggan = item.id_pelanggan;
            this.form.id_promo = item.id_promo;
            this.form.id_pegawai = localStorage.getItem('id_pegawai');
            this.form.tgl_transaksi = item.tgl_transaksi;
            this.form.metode_pembayaran = item.metode_pembayaran;
            this.dialog = true;
        },

        deleteHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },

        close(){
            this.dialog = false;
            this.dialogConfirm = false;
            this.readDataTransaksi();
            this.readDataPelanggan();
            this.readDataPromo();
            this.readDataPegawai();
        },

        cancel(){
            this.resetForm();
            this.readDataTransaksi();
            this.readDataPelanggan();
            this.readDataPromo();
            this.readDataPegawai();
            this.dialog = false;
            this.dialogConfirm = false;
        },

        resetForm(){
            this.form ={
                id_pelanggan: '',
                id_promo: '',
                id_pegawai: localStorage.getItem('id_pegawai'),
                tgl_transaksi: '',
                metode_pembayaran: '',
            };
        },
    },
    mounted(){
        this.readDataTransaksi();
        this.readDataPelanggan();
        this.readDataPromo();
        this.readDataPegawai();
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
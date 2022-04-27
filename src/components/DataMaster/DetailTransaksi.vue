<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Detail Transaksi</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="detailTransaksis" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                <v-icon dense color="red" @click="deleteHandler(item.id_detail_transaksi)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Detail Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="transaksis" v-model="form.id_transaksi" label="Transaksi" item-value="id_transaksi" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_transaksi }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_transaksi }}
	                        </template>
                        </v-select>
                        <v-select :items="mobils" v-model="form.id_mobil" label="Mobil" item-value="id_mobil" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.plat_mobil }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.plat_mobil }}
	                        </template>
                        </v-select>
                        <v-select :items="drivers" v-model="form.id_driver" label="Driver" item-value="id_driver" clearable required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_driver }} - {{ data.item.nama_driver }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_driver }} - {{ data.item.nama_driver }}
	                        </template>
                        </v-select>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_mulai_sewa" label="Tanggal Waktu Mulai Sewa" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_akhir_sewa" label="Tanggal Waktu Akhir Sewa" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tgl_pengembalian" label="Tanggal Pengembalian" required></v-text-field>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="transaksis" v-model="form.id_transaksi" label="Transaksi" item-value="id_transaksi" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_transaksi }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_transaksi }}
	                        </template>
                        </v-select>
                        <v-select :items="mobils" v-model="form.id_mobil" label="Mobil" item-value="id_mobil" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.plat_mobil }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.plat_mobil }}
	                        </template>
                        </v-select>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_mulai_sewa" label="Tanggal Waktu Mulai Sewa" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_akhir_sewa" label="Tanggal Waktu Akhir Sewa" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tgl_pengembalian" label="Tanggal Pengembalian" required></v-text-field>
                        <v-text-field v-if="form.id_driver != null" v-model="form.rating_driver_transaksi" label="Rating Driver Transaksi" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>Anda Yakin ingin menghapus detail transaksi ini?</v-card-text>
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
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Id Detail Transaksi", align: "start", sortable: true, value: "id_detail_transaksi", },
                { text: "Id Transaksi", value: "id_transaksi" },
                { text: "Plat Mobil", value: "plat_mobil" },
                { text: "Driver", value: "nama_driver" },
                { text: "Jenis", value: "jenis_transaksi" },
                { text: "Tanggal Mulai Sewa", value: "tgl_waktu_mulai_sewa" },
                { text: "Tanggal Akhir Sewa", value: "tgl_waktu_akhir_sewa" },
                { text: "Tanggal Pengembalian", value: "tgl_pengembalian" },
                { text: "Rating Driver", value: "rating_driver_transaksi" },
                { text: "Denda", value: "denda_transaksi" },
                { text: "Jumlah", value: "jumlah_pembayaran" },
                { text: "Action", value: "actions" },
            ],
            detailTransaksi: new FormData(),
            detailTransaksis: [],
            transaksis: [],
            mobils: [],
            drivers: [],
            form: {
                id_transaksi: '',
                id_mobil: '',
                id_driver: '',
                tgl_waktu_mulai_sewa: '',
                tgl_waktu_akhir_sewa: '',
                tgl_pengembalian: '',
                rating_driver_transaksi: '',
            },
            deleteId: '',
            editId: '',
        };
    },
    methods: {
        setForm(){
            if (this.inputType !== 'Tambah') {
                this.update();
            } else {
                this.save();
            }
        },

        //Read Data Detail Transaksi
        readDataDetailTransaksi() {
            var url = this.$api + '/detailTransaksi';
            this.$http.get(url).then((response) => {
                this.detailTransaksis = response.data.data;
            });
        },

        //Read Data Transaksi
        readDataTransaksi() {
            var url = this.$api + '/transaksi';
            this.$http.get(url).then((response) => {
                this.transaksis = response.data.data;
            });
        },

        //Read Data Mobil
        readDataMobil() {
            var url = this.$api + '/mobil';
            this.$http.get(url).then((response) => {
                this.mobils = response.data.data;
            });
        },

        //Read Data Driver
        readDataDriver() {
            var url = this.$api + '/driver';
            this.$http.get(url).then((response) => {
                this.drivers = response.data.data;
            });
        },

        //Insert Data Mobil
        save(){            
            this.detailTransaksi.append('id_transaksi', this.form.id_transaksi);
            this.detailTransaksi.append('id_driver', this.form.id_driver ?? '');
            this.detailTransaksi.append('id_mobil', this.form.id_mobil);
            this.detailTransaksi.append('tgl_waktu_mulai_sewa', this.form.tgl_waktu_mulai_sewa);
            this.detailTransaksi.append('tgl_waktu_akhir_sewa', this.form.tgl_waktu_akhir_sewa);
            this.detailTransaksi.append('tgl_pengembalian', this.form.tgl_pengembalian);
            this.detailTransaksi.append('rating_driver_transaksi', this.form.rating_driver_transaksi);

            var url = this.$api + '/detailTransaksi';
            this.load = true;
            this.$http.post(url, this.detailTransaksi, {
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
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
            this.resetForm();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Update Data Mobil
        update(){
            var data = new FormData();

            data.append('id_transaksi', this.form.id_transaksi);
            data.append('id_mobil', this.form.id_mobil);
            data.append('tgl_waktu_mulai_sewa', this.form.tgl_waktu_mulai_sewa);
            data.append('tgl_waktu_akhir_sewa', this.form.tgl_waktu_akhir_sewa);
            data.append('tgl_pengembalian', this.form.tgl_pengembalian);
            data.append('rating_driver_transaksi', this.form.rating_driver_transaksi);

            var url = this.$api + '/detailTransaksi/' + this.editId;
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
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
            this.resetForm();
            this.inputType = 'Tambah';
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
            var url = this.$api + "/detailTransaksi/" + this.deleteId;
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
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
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
            this.editId = item.id_detail_transaksi;
            this.form.id_transaksi = item.id_transaksi;
            this.form.id_mobil = item.id_mobil;
            this.form.id_driver = item.id_driver;
            this.form.tgl_waktu_mulai_sewa = item.tgl_waktu_mulai_sewa;
            this.form.tgl_waktu_akhir_sewa = item.tgl_waktu_akhir_sewa;
            this.form.tgl_pengembalian = item.tgl_pengembalian;
            this.form.rating_driver_transaksi = item.rating_driver_transaksi;
            this.dialog = true;
            },

        deleteHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },

        close(){
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
        },

        cancel(){
            this.resetForm();
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                id_transaksi: '',
                id_mobil: '',
                id_driver: '',
                tgl_waktu_mulai_sewa: '',
                tgl_waktu_akhir_sewa: '',
                tgl_pengembalian: '',
                rating_driver_transaksi: '',
            };
        },
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
    mounted(){
        this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
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
<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Transaksi</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
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
                <span class="headline">{{ formTitle }} Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="pelanggans" v-model="form.id_pelanggan" label="Pelanggan" item-value="id_pelanggan" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_pelanggan }} - {{ data.item.nama_pelanggan }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_pelanggan }} - {{ data.item.nama_pelanggan }}
	                        </template>
                        </v-select>
                        <v-select :items="promos" v-model="form.id_promo" label="Promo" item-value="id_promo" clearable required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_promo }} - {{ data.item.kode_promo }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_promo }} - {{ data.item.kode_promo }}
	                        </template>
                        </v-select>
                        <v-select :items="pegawais" v-model="form.id_pegawai" label="Pegawai" item-value="id_pegawai" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                        </v-select>
                        <v-text-field type="date" v-model="form.tgl_transaksi" label="Tanggal Transaksi" required></v-text-field>
                        <v-select v-model="form.metode_pembayaran" label="Metode Pembayaran" :items="metode" required></v-select>
                        <v-select v-model="form.status_transaksi" label="Status Transaksi" :items="statusTransaksi" required></v-select>
                        <v-select v-model="form.status_dokumen" label="Status Dokumen" :items="statusDokumen" required></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="pelanggans" v-model="form.id_pelanggan" label="Pelanggan" item-value="id_pelanggan" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_pelanggan }} - {{ data.item.nama_pelanggan }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_pelanggan }} - {{ data.item.nama_pelanggan }}
	                        </template>
                        </v-select>
                        <v-select :items="pegawais" v-model="form.id_pegawai" label="Pegawai" item-value="id_pegawai" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                        </v-select>
                        <v-text-field type="date" v-model="form.tgl_transaksi" label="Tanggal Transaksi" required></v-text-field>
                        <v-select v-model="form.metode_pembayaran" label="Metode Pembayaran" :items="metode" required></v-select>
                        <v-select v-model="form.status_transaksi" label="Status Transaksi" :items="statusTransaksi" required></v-select>
                        <v-select v-model="form.status_dokumen" label="Status Dokumen" :items="statusDokumen" required></v-select>
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
            inputType: 'Tambah',
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
                { text: "Status Transaksi", value: "status_transaksi" },
                { text: "Status Dokumen", value: "status_dokumen" },
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
                id_pegawai: '',
                tgl_transaksi: '',
                metode_pembayaran: '',
                status_transaksi: '',
                status_dokumen: '',
            },
            deleteId: '',
            editId: '',
            metode: [ 'Tunai', 'Non Tunai' ],
            statusTransaksi: [ 'Belum Lunas Belum Verifikasi', 'Sudah Lunas Belum Verifikasi', 'Sudah Lunas Sudah Verifikasi' ],
            statusDokumen: [ 'Sudah Verifikasi', 'Belum Verifikasi' ],
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

        //Insert Data Mobil
        save(){            
            this.transaksi.append('id_pelanggan', this.form.id_pelanggan);
            this.transaksi.append('id_promo', this.form.id_promo ?? '');
            this.transaksi.append('id_pegawai', this.form.id_pegawai);
            this.transaksi.append('tgl_transaksi', this.form.tgl_transaksi);
            this.transaksi.append('metode_pembayaran', this.form.metode_pembayaran);
            this.transaksi.append('status_transaksi', this.form.status_transaksi);
            this.transaksi.append('status_dokumen', this.form.status_dokumen);

            var url = this.$api + '/transaksi';
            this.load = true;
            this.$http.post(url, this.transaksi, {
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

            data.append('id_pelanggan', this.form.id_pelanggan);
            data.append('id_pegawai', this.form.id_pegawai);
            data.append('tgl_transaksi', this.form.tgl_transaksi);
            data.append('metode_pembayaran', this.form.metode_pembayaran);
            data.append('status_transaksi', this.form.status_transaksi);
            data.append('status_dokumen', this.form.status_dokumen);

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
            this.form.id_pegawai = item.id_pegawai;
            this.form.tgl_transaksi = item.tgl_transaksi;
            this.form.metode_pembayaran = item.metode_pembayaran;
            this.form.status_transaksi = item.status_transaksi;
            this.form.status_dokumen = item.status_dokumen;
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
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                id_pelanggan: null,
                id_promo: null,
                id_pegawai: null,
                tgl_transaksi: null,
                metode_pembayaran: null,
                status_transaksi: null,
                status_dokumen: null,
            };
        },
    },
    computed:{
        formTitle() {
            return this.inputType;
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
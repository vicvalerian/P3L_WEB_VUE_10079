<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Detail Transaksi Pelanggan</h1>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="detailTransaksis" :search="search">
                <template v-slot:[`item.status_transaksi`]="{ item }">
                    <v-chip v-if="item.status_transaksi === 'Belum Lunas Belum Verifikasi'" color="red" outlined>{{ item.status_transaksi }}</v-chip>
                    <v-chip v-if="item.status_transaksi === 'Belum Lunas Sudah Verifikasi'" color="orange" outlined>{{ item.status_transaksi }}</v-chip>
                    <v-chip v-if="item.status_transaksi === 'Sudah Lunas Sudah Verifikasi'" color="green" outlined>{{ item.status_transaksi }}</v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on"><v-icon color="black">mdi-dots-vertical</v-icon></v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-if="item.tgl_pengembalian !== null" class="primary--text" @click="printNota(item)">
                                Cetak Nota
                                <v-icon right color="primary">mdi-download</v-icon>
                            </v-list-item>
                            <v-list-item v-if="item.status_transaksi !== 'Sudah Lunas Sudah Verifikasi'" class="green--text" @click="editHandlerBefore(item)">
                                Update Data
                                <v-icon right color="success">mdi-pencil</v-icon>
                            </v-list-item>
                            <v-list-item v-if="item.bukti_pembayaran !== null" class="indigo--text" @click="showBuktiPembayaran(item)">
                                Bukti Pembayaran
                                <v-icon right color="indigo">mdi-file</v-icon>
                            </v-list-item>
                            <v-list-item v-if="item.id_driver !== null && item.status_transaksi === 'Sudah Lunas Sudah Verifikasi' && item.jenis_transaksi === 'Dengan Driver'" class="orange--text" @click="editHandlerAfter(item)">
                                Rating Driver
                                <v-icon right color="orange">mdi-star</v-icon>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Tambah Detail Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
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
		                        {{ data.item.id_mobil }} - {{ data.item.nama_mobil }} - Rp{{ data.item.sewa_harian_mobil }}/hari
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.nama_mobil }} - Rp{{ data.item.sewa_harian_mobil }}/hari
	                        </template>
                        </v-select>
                        <!-- <v-select :items="drivers" v-model="form.id_driver" label="Driver" item-value="id_driver" clearable required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_driver }} - {{ data.item.nama_driver }} - {{ data.item.sewa_harian_driver }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_driver }} - {{ data.item.nama_driver }} - {{ data.item.sewa_harian_driver }}
	                        </template>
                        </v-select> -->
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_mulai_sewa" label="Tanggal Waktu Mulai Sewa" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_akhir_sewa" label="Tanggal Waktu Akhir Sewa" required></v-text-field>
                        <v-select v-if="simPelanggan != 'null'" :items="jenisTransaksi" v-model="form.jenis_transaksi" label="Jenis Transaksi" required></v-select>
                        <v-select v-else :items="denganDriver" v-model="form.jenis_transaksi" label="Jenis Transaksi" required></v-select>
                        <span v-if="simPelanggan == 'null'" class="red--text">
                            <b>*Pelanggan Yang Tidak Memiliki SIM WAJIB Menggunakan Driver</b>
                        </span>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBeforeVerif" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Update Detail Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select :items="mobils" v-model="form.id_mobil" label="Mobil" item-value="id_mobil" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.nama_mobil }} - Rp{{ data.item.sewa_harian_mobil }}/hari
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_mobil }} - {{ data.item.nama_mobil }} - Rp{{ data.item.sewa_harian_mobil }}/hari
	                        </template>
                        </v-select>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_mulai_sewa" label="Tanggal Waktu Mulai Sewa" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tgl_waktu_akhir_sewa" label="Tanggal Waktu Akhir Sewa" required></v-text-field>
                        <v-select v-if="simPelanggan != 'null'" :items="jenisTransaksi" v-model="form.jenis_transaksi" label="Jenis Transaksi" required></v-select>
                        <v-select v-else :items="denganDriver" v-model="form.jenis_transaksi" label="Jenis Transaksi" required></v-select>
                        <span v-if="simPelanggan == 'null'" class="red--text">
                            <b>*Pelanggan Yang Tidak Memiliki SIM WAJIB Menggunakan Driver</b>
                        </span>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="updateBefore"> Update </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPembayaran" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Bukti Pembayaran Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="fileBuktiPembayaran">
                            <v-file-input append-icon="mdi-camera" accept="image/*"
                                label="Bukti Pembayaran" id="buktiPembayaran"></v-file-input>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelBuktiPembayaran"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="updateBuktiPembayaran"> Update </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAfterVerif" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Tambah Rating Driver</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <span><b>Rating Driver</b></span>
                        <v-rating v-model="form.rating_driver_transaksi"
                            background-color="orange lighten-3" color="orange" label="Rating Driver" medium required></v-rating>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="updateAfter"> Update </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDokumen" persistent max-width="600px">
            <v-card>
                <v-card-title >
                    <span class="headline">Bukti Pembayaran Transaksi</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-container fluid>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <div><v-img width="350px" :src="previewBuktiPembayaran == '' ? $baseUrl+'/storage/'+form.bukti_pembayaran : previewBuktiPembayaran" id="buktiPembayaran" class="mb-5"></v-img></div>
                        </v-flex>
                    </v-layout>
                </v-container>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDokumen = false">Close</v-btn>
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
            search: null,
            dialog: false,
            dialogBeforeVerif: false,
            dialogPembayaran: false,
            dialogAfterVerif: false,
            dialogDokumen: false,
            error_message: '',
            snackbar: false,
            load: false,
            color: '',
            id_pelanggan: localStorage.getItem('id_pelanggan'),
            headers: [
                { text: "Id Transaksi", align: "start", sortable: true, value: "id_transaksi" },
                { text: "Id Detail Transaksi", value: "id_detail_transaksi", },
                { text: "Plat Mobil", value: "plat_mobil" },
                { text: "Driver", value: "nama_driver" },
                { text: "Jenis", value: "jenis_transaksi" },
                { text: "Tanggal Mulai Sewa", value: "tgl_waktu_mulai_sewa" },
                { text: "Tanggal Akhir Sewa", value: "tgl_waktu_akhir_sewa" },
                { text: "Tanggal Pengembalian", value: "tgl_pengembalian" },
                { text: "Rating Driver", value: "rating_driver_transaksi" },
                { text: "Status", value: "status_transaksi" },
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
                status_transaksi: '',
                jenis_transaksi: '',
            },
            editId: '',
            previewBuktiPembayaran: '',
            jenisTransaksi: [ 'Dengan Driver', 'Tanpa Driver' ],
            simPelanggan: '',
            denganDriver: ['Dengan Driver'],
        };
    },
    methods: {
        onPreviewImage(e) {
            this.previewBuktiPembayaran = URL.createObjectURL(e);
        },

        //Read Data Detail Transaksi
        readDataDetailTransaksi() {
            var url = this.$api + '/detailTransaksiPelanggan/' + localStorage.getItem('id_pelanggan');
            this.$http.get(url).then((response) => {
                this.detailTransaksis = response.data.data;
            });
        },

        //Read Data Transaksi
        readDataTransaksi() {
            var url = this.$api + '/transaksiVerifPelanggan/' + localStorage.getItem('id_pelanggan');
            this.$http.get(url).then((response) => {
                this.transaksis = response.data.data;
            });
        },

        //Read Data Mobil
        readDataMobil() {
            var url = this.$api + '/statusMobil';
            this.$http.get(url).then((response) => {
                this.mobils = response.data.data;
            });
        },

        //Read Data Driver
        readDataDriver() {
            var url = this.$api + '/statusDriver';
            this.$http.get(url).then((response) => {
                this.drivers = response.data.data;
            });
        },

        //Insert Data Detail Transaksi
        save(){
            this.detailTransaksi.append('id_transaksi', this.form.id_transaksi);
            this.detailTransaksi.append('id_driver', this.form.id_driver ?? '');
            this.detailTransaksi.append('id_mobil', this.form.id_mobil);
            this.detailTransaksi.append('tgl_waktu_mulai_sewa', this.form.tgl_waktu_mulai_sewa);
            this.detailTransaksi.append('tgl_waktu_akhir_sewa', this.form.tgl_waktu_akhir_sewa);
            this.detailTransaksi.append('jenis_transaksi', this.form.jenis_transaksi);
            // this.detailTransaksi.append('tgl_pengembalian', this.form.tgl_pengembalian);
            // this.detailTransaksi.append('rating_driver_transaksi', this.form.rating_driver_transaksi);

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

        //Update Data Detail Transaksi Before Verif
        updateBefore(){
            var data = new FormData();

            data.append('id_mobil', this.form.id_mobil);
            data.append('tgl_waktu_mulai_sewa', this.form.tgl_waktu_mulai_sewa);
            data.append('tgl_waktu_akhir_sewa', this.form.tgl_waktu_akhir_sewa);
            data.append('jenis_transaksi', this.form.jenis_transaksi ?? '');

            var url = this.$api + '/detailTransaksiBeforePelanggan/' + this.editId;
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
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        //Update Data Detail Transaksi Before Verif
        updateBuktiPembayaran(){
            var data = new FormData();

            data.append('id_mobil', this.form.id_mobil ?? '');
            data.append('tgl_waktu_mulai_sewa', this.form.tgl_waktu_mulai_sewa ?? '');
            data.append('tgl_waktu_akhir_sewa', this.form.tgl_waktu_akhir_sewa ?? '');
            data.append('jenis_transaksi', this.form.jenis_transaksi ?? '');

            var inputBuktiPembayaran = document.getElementById('buktiPembayaran'),
            dataBuktiPembayaran = inputBuktiPembayaran.files[0];

            if(dataBuktiPembayaran){
                data.append('bukti_pembayaran', dataBuktiPembayaran);
            }

            var url = this.$api + '/detailTransaksiBeforePelanggan/' + this.editId;
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
                this.closeBuktiPembayaran();
                this.readDataDetailTransaksi();
                this.readDataTransaksi();
                this.readDataMobil();
                this.readDataDriver();
                this.resetFormBuktiPembayaran();
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        //Update Data Detail Transaksi After Verif
        updateAfter(){
            var data = new FormData();

            data.append('rating_driver_transaksi', this.form.rating_driver_transaksi ?? '');

            var url = this.$api + '/detailTransaksiAfterPelanggan/' + this.editId;
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
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        cancel(){
            this.resetForm();
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
            this.dialog = false;
            this.dialogBeforeVerif = false;
            this.dialogAfterVerif = false;
        },

        cancelBuktiPembayaran(){
            this.resetFormBuktiPembayaran();
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
            this.dialogPembayaran = false;
        },

        close(){
            this.dialog = false;
            this.dialogBeforeVerif = false;
            this.dialogAfterVerif = false;
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
        },

        closeBuktiPembayaran(){
            this.dialogPembayaran = false;
            this.readDataDetailTransaksi();
            this.readDataTransaksi();
            this.readDataMobil();
            this.readDataDriver();
        },

        resetForm(){
            this.form = {
                id_transaksi: '',
                id_mobil: '',
                id_driver: '',
                tgl_waktu_mulai_sewa: '',
                tgl_waktu_akhir_sewa: '',
                tgl_pengembalian: '',
                rating_driver_transaksi: '',
                status_transaksi: '',
                jenis_transaksi: '',
            };
            // document.getElementById('buktiPembayaran').value = '';
        },

        resetFormBuktiPembayaran(){
            this.$refs.fileBuktiPembayaran.reset();
        },

        editHandlerBefore(item){
            this.editId = item.id_detail_transaksi;
            this.form.id_mobil = item.id_mobil;
            this.form.tgl_waktu_mulai_sewa = item.tgl_waktu_mulai_sewa;
            this.form.tgl_waktu_akhir_sewa = item.tgl_waktu_akhir_sewa;
            this.form.tgl_pengembalian = item.tgl_pengembalian;
            this.form.bukti_pembayaran = item.bukti_pembayaran;
            this.form.status_transaksi = item.status_transaksi;
            this.form.jenis_transaksi = item.jenis_transaksi;
            if(this.form.status_transaksi === 'Belum Lunas Belum Verifikasi'){
                this.dialogBeforeVerif = true;
            } else if(this.form.status_transaksi === 'Belum Lunas Sudah Verifikasi' && this.form.tgl_pengembalian !== null){
                this.dialogPembayaran = true;
            }
        },

        editHandlerAfter(item){
            this.editId = item.id_detail_transaksi;
            this.form.id_driver = item.id_driver;
            this.form.rating_driver_transaksi = item.rating_driver_transaksi;
            this.form.tgl_pengembalian = item.tgl_pengembalian;
            this.form.status_transaksi = item.status_transaksi;
            this.dialogAfterVerif = true;
        },

        showBuktiPembayaran(item){
            this.form.bukti_pembayaran = item.bukti_pembayaran;
            this.dialogDokumen = true;
        },

        printNota(item){
            this.idNota = item.id_detail_transaksi;
            this.$http.get(this.$api + '/generate-pdf/' + this.idNota, {
                responseType: 'arraybuffer'
            })
            .then(response => {
                let blob = new Blob([response.data], { type: 'application/pdf' })
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = 'Nota Pembayaran.pdf'
                link.click()
            })
        },

        readSimPelanggan(){
            this.simPelanggan = localStorage.getItem('no_sim_pelanggan');
        }
    },
    mounted(){
        this.readDataDetailTransaksi();
        this.readDataTransaksi();
        this.readDataMobil();
        this.readDataDriver();
        this.readSimPelanggan();
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
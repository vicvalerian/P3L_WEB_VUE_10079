<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Mobil</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="mobils" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                <v-icon dense color="red" @click="deleteHandler(item.id_mobil)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Mobil</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.plat_mobil" label="Plat Mobil" required></v-text-field>
                        <v-select :items="pemiliks" v-model="form.id_pemilik" label="Pemilik" item-value="id_pemilik" clearable required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.no_ktp_pemilik }} - {{ data.item.nama_pemilik }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.no_ktp_pemilik }} - {{ data.item.nama_pemilik }}
	                        </template>
                        </v-select>
                        <v-text-field v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
                        <v-text-field v-model="form.tipe_mobil" label="Tipe Mobil" required></v-text-field>
                        <v-select v-model="form.jenis_transmisi" label="Jenis Transmisi" :items="transmisi" required></v-select>
                        <v-select v-model="form.jenis_bahan_bakar" label="Jenis Bahan Bakar" :items="bahanBakar" required></v-select>
                        <v-text-field v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
                        <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                        <v-text-field v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang" required></v-text-field>
                        <v-text-field v-model="form.fasilitas_mobil" label="Fasilitas Mobil" required></v-text-field>
                        <v-text-field v-model="form.no_stnk" label="No STNK" required></v-text-field>
                        <v-text-field v-model="form.sewa_harian_mobil" label="Sewa Harian Mobil" required></v-text-field>
                        <v-text-field v-model="form.volume_bagasi" label="Volume Bagasi" required></v-text-field>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="pemiliks" v-model="form.id_pemilik" label="Pemilik" item-value="id_pemilik" clearable required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.no_ktp_pemilik }} - {{ data.item.nama_pemilik }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.no_ktp_pemilik }} - {{ data.item.nama_pemilik }}
	                        </template>
                        </v-select>
                        <v-text-field v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
                        <v-text-field v-model="form.tipe_mobil" label="Tipe Mobil" required></v-text-field>
                        <v-select v-model="form.jenis_transmisi" label="Jenis Transmisi" :items="transmisi" required></v-select>
                        <v-select v-model="form.jenis_bahan_bakar" label="Jenis Bahan Bakar" :items="bahanBakar" required></v-select>
                        <v-text-field v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
                        <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                        <v-text-field v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang" required></v-text-field>
                        <v-text-field v-model="form.fasilitas_mobil" label="Fasilitas Mobil" required></v-text-field>
                        <v-text-field v-model="form.no_stnk" label="No STNK" required></v-text-field>
                        <v-text-field v-model="form.sewa_harian_mobil" label="Sewa Harian Mobil" required></v-text-field>
                        <v-text-field v-model="form.volume_bagasi" label="Volume Bagasi" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus mobil ini?</v-card-text>
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
                { text: "Id Mobil", align: "start", sortable: true, value: "id_mobil", },
                { text: "Plat Mobil", value: "plat_mobil", },
                { text: "Pemilik", value: "nama_pemilik" },
                { text: "Nama", value: "nama_mobil" },
                { text: "Tipe", value: "tipe_mobil" },
                { text: "Jenis Transmisi", value: "jenis_transmisi" },
                { text: "Jenis Bahan Bakar", value: "jenis_bahan_bakar" },
                { text: "Volume Bahan Bakar", value: "volume_bahan_bakar" },
                { text: "Warna", value: "warna_mobil" },
                { text: "Kapasitas Penumpang", value: "kapasitas_penumpang" },
                { text: "Fasilitas Mobil", value: "fasilitas_mobil" },
                { text: "No STNK", value: "no_stnk" },
                { text: "Kategori Aset", value: "kategori_aset" },
                { text: "Sewa Harian", value: "sewa_harian_mobil" },
                { text: "Volume Bagasi", value: "volume_bagasi" },
                { text: "Action", value: "actions" },
            ],
            mobil: new FormData(),
            mobils: [],
            pemiliks: [],
            form: {
                plat_mobil: '',
                id_pemilik: '',
                nama_mobil: '',
                tipe_mobil: '',
                jenis_transmisi: '',
                jenis_bahan_bakar: '',
                volume_bahan_bakar: '',
                warna_mobil: '',
                kapasitas_penumpang: '',
                fasilitas_mobil: '',
                no_stnk: '',
                sewa_harian_mobil: '',
                volume_bagasi: '',
            },
            deleteId: '',
            editId: '',
            transmisi: [ 'AT', 'CVT', 'Manual' ],
            bahanBakar: [ 'Pertalite', 'Pertamax', 'Dexlite' ],
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

        //Read Data Mobil
        readDataMobil() {
            var url = this.$api + '/mobil';
            this.$http.get(url).then((response) => {
                this.mobils = response.data.data;
            });
        },

        //Read Data Pemilik
        readDataPemilik() {
            var url = this.$api + '/pemilik';
            this.$http.get(url).then((response) => {
                this.pemiliks = response.data.data;
            });
        },

        //Insert Data Mobil
        save(){
            this.mobil.append('plat_mobil', this.form.plat_mobil);

            this.mobil.append('id_pemilik', this.form.id_pemilik ?? '');
            this.mobil.append('nama_mobil', this.form.nama_mobil);
            this.mobil.append('tipe_mobil', this.form.tipe_mobil);
            this.mobil.append('jenis_transmisi', this.form.jenis_transmisi);
            this.mobil.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
            this.mobil.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
            this.mobil.append('warna_mobil', this.form.warna_mobil);
            this.mobil.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
            this.mobil.append('fasilitas_mobil', this.form.fasilitas_mobil);
            this.mobil.append('no_stnk', this.form.no_stnk);
            this.mobil.append('sewa_harian_mobil', this.form.sewa_harian_mobil);
            this.mobil.append('volume_bagasi', this.form.volume_bagasi);

            var url = this.$api + '/mobil';
            this.load = true;
            this.$http.post(url, this.mobil, {
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
            this.readDataMobil();
            this.readDataPemilik();
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

            data.append('id_pemilik', this.form.id_pemilik ?? '');
            data.append('nama_mobil', this.form.nama_mobil);
            data.append('tipe_mobil', this.form.tipe_mobil);
            data.append('jenis_transmisi', this.form.jenis_transmisi);
            data.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
            data.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
            data.append('warna_mobil', this.form.warna_mobil);
            data.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
            data.append('fasilitas_mobil', this.form.fasilitas_mobil);
            data.append('no_stnk', this.form.no_stnk);
            data.append('sewa_harian_mobil', this.form.sewa_harian_mobil);
            data.append('volume_bagasi', this.form.volume_bagasi);

            var url = this.$api + '/mobil/' + this.editId;
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
            this.readDataMobil();
            this.readDataPemilik();
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
            var url = this.$api + "/mobil/" + this.deleteId;
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
            this.readDataMobil();
            this.readDataPemilik();
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
            this.editId = item.id_mobil;
            this.form.id_pemilik = item.id_pemilik;
            this.form.nama_mobil = item.nama_mobil;
            this.form.tipe_mobil = item.tipe_mobil;
            this.form.jenis_transmisi = item.jenis_transmisi;
            this.form.jenis_bahan_bakar = item.jenis_bahan_bakar;
            this.form.volume_bahan_bakar = item.volume_bahan_bakar;
            this.form.warna_mobil = item.warna_mobil;
            this.form.kapasitas_penumpang = item.kapasitas_penumpang;
            this.form.fasilitas_mobil = item.fasilitas_mobil;
            this.form.no_stnk = item.no_stnk;
            this.form.sewa_harian_mobil = item.sewa_harian_mobil;
            this.form.volume_bagasi = item.volume_bagasi;
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
            this.readDataMobil();
            this.readDataPemilik();
        },

        cancel(){
            this.resetForm();
            this.readDataMobil();
            this.readDataPemilik();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                plat_mobil: null,
                id_mobil: null,
                nama_mobil: null,
                tipe_mobil: null,
                jenis_transmisi: null,
                jenis_bahan_bakar: null,
                volume_bahan_bakar: null,
                warna_mobil: null,
                kapasitas_penumpang: null,
                fasilitas_mobil: null,
                no_stnk: null,
                sewa_harian_mobil: null,
                volume_bagasi: null,
            };
        },
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
    mounted(){
        this.readDataMobil();
        this.readDataPemilik();
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
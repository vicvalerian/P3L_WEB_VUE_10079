<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Pemilik</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="pemiliks" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                <v-icon dense color="red" @click="deleteHandler(item.id_pemilik)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Pemilik</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.no_ktp_pemilik" label="Nomor KTP" counter="16" required></v-text-field>
                        <v-text-field v-model="form.nama_pemilik" label="Nama Pemilik" required></v-text-field>
                        <v-text-field v-model="form.alamat_pemilik" label="Alamat Pemilik" required></v-text-field>
                        <v-text-field v-model="form.notelp_pemilik" label="Nomor Telepon" required></v-text-field>
                        <v-text-field type="date" v-model="form.periode_kontrak_mulai" label="Periode Kontrak Mulai" required></v-text-field>
                        <v-text-field type="date" v-model="form.periode_kontrak_akhir" label="Periode Kontrak AKhir" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_servis_terakhir" label="Tanggal Servis Terakhir" required></v-text-field>
                    </v-container>
                    <v-container v-else>
                        <v-text-field v-model="form.nama_pemilik" label="Nama Pemilik" required></v-text-field>
                        <v-text-field v-model="form.alamat_pemilik" label="Alamat Pemilik" required></v-text-field>
                        <v-text-field v-model="form.notelp_pemilik" label="Nomor Telepon" required></v-text-field>
                        <v-text-field type="date" v-model="form.periode_kontrak_mulai" label="Periode Kontrak Mulai" required></v-text-field>
                        <v-text-field type="date" v-model="form.periode_kontrak_akhir" label="Periode Kontrak AKhir" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_servis_terakhir" label="Tanggal Servis Terakhir" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus pemilik ini?</v-card-text>
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
                { text: "Id", align: "start", sortable: true, value: "id_pemilik", },
                { text: "Nomor KTP", value: "no_ktp_pemilik", },
                { text: "Nama", value: "nama_pemilik" },
                { text: "Alamat", value: "alamat_pemilik" },
                { text: "Nomor Telepon", value: "notelp_pemilik" },
                { text: "Periode Kontrak Mulai", value: "periode_kontrak_mulai" },
                { text: "Periode Kontrak Akhir", value: "periode_kontrak_akhir" },
                { text: "Tanggal Servis Terakhir", value: "tgl_servis_terakhir" },
                { text: "Action", value: "actions" },
            ],
            pemilik: new FormData(),
            pemiliks: [],
            form: {
                no_ktp_pemilik: '',
                nama_pemilik: '',
                alamat_pemilik: '',
                notelp_pemilik: '',
                periode_kontrak_mulai: '',
                periode_kontrak_akhir: '',
                tgl_servis_terakhir: '',
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

        //Read Data Pemilik
        readData() {
            var url = this.$api + '/pemilik';
            this.$http.get(url).then((response) => {
                this.pemiliks = response.data.data;
            });
        },

        //Insert Data Pemilik
        save(){
            this.pemilik.append('no_ktp_pemilik', this.form.no_ktp_pemilik);
            this.pemilik.append('nama_pemilik', this.form.nama_pemilik);
            this.pemilik.append('alamat_pemilik', this.form.alamat_pemilik);
            this.pemilik.append('notelp_pemilik', this.form.notelp_pemilik);
            this.pemilik.append('periode_kontrak_mulai', this.form.periode_kontrak_mulai);
            this.pemilik.append('periode_kontrak_akhir', this.form.periode_kontrak_akhir);
            this.pemilik.append('tgl_servis_terakhir', this.form.tgl_servis_terakhir);

            var url = this.$api + '/pemilik';
            this.load = true;
            this.$http.post(url, this.pemilik, {
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
            this.readData();
            this.resetForm();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Update Data Pemilik
        update(){
            var data = new FormData();
            data.append('nama_pemilik', this.form.nama_pemilik);
            data.append('alamat_pemilik', this.form.alamat_pemilik);
            data.append('notelp_pemilik', this.form.notelp_pemilik);
            data.append('periode_kontrak_mulai', this.form.periode_kontrak_mulai);
            data.append('periode_kontrak_akhir', this.form.periode_kontrak_akhir);
            data.append('tgl_servis_terakhir', this.form.tgl_servis_terakhir);

            var url = this.$api + '/pemilik/' + this.editId;
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
            this.readData();
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

        //Delete Data Pemilik
        deleteData(){
            var url = this.$api + "/pemilik/" + this.deleteId;
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
            this.readData();
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
            this.editId = item.id_pemilik;
            this.form.nama_pemilik = item.nama_pemilik;
            this.form.alamat_pemilik = item.alamat_pemilik;
            this.form.notelp_pemilik = item.notelp_pemilik;
            this.form.periode_kontrak_mulai = item.periode_kontrak_mulai;
            this.form.periode_kontrak_akhir = item.periode_kontrak_akhir;
            this.form.tgl_servis_terakhir = item.tgl_servis_terakhir;
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
            this.readData();
        },

        cancel(){
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                no_ktp_pemilik: null,
                nama_pemilik: null,
                alamat_pemilik: null,
                notelp_pemilik: null,
                periode_kontrak_mulai: null,
                periode_kontrak_akhir: null,
                tgl_servis_terakhir: null,
            };
        },
    },
    computed:{
        formTitle() {
            return this.inputType;
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
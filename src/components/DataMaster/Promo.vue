<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Promo</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="promos" :search="search" :expanded.sync="expanded" item-key="kode_promo" show-expand class="elevation-1">
                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length" class="text-left">
                        Keterangan: {{ item.keterangan_promo }}
                    </td>
                </template>
                <template v-slot:[`item.status_promo`]="{ item }">
                    <v-chip v-if="item.status_promo === 'Aktif'" color="green" outlined>{{ item.status_promo }}</v-chip>
                    <v-chip v-if="item.status_promo === 'Tidak Aktif'" color="red" outlined>{{ item.status_promo }}</v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                    <v-icon dense color="red" @click="deleteHandler(item.id_promo)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Promo</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.kode_promo" label="Kode Promo" required></v-text-field>
                        <v-text-field v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
                        <v-textarea v-model="form.keterangan_promo" label="Keterangan Promo" required></v-textarea>
                        <v-text-field v-model="form.diskon_promo" label="Diskon Promo" required></v-text-field>
                        <v-select v-model="form.status_promo" :items="status" label="Status Promo" required></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-text-field v-model="form.kode_promo" label="Kode Promo" required></v-text-field>
                        <v-text-field v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
                        <v-textarea v-model="form.keterangan_promo" label="Keterangan Promo" required></v-textarea>
                        <v-text-field v-model="form.diskon_promo" label="Diskon Promo" required></v-text-field>
                        <v-select v-model="form.status_promo" :items="status" label="Status Promo" required></v-select>
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
                <v-card-text>Anda Yakin ingin menghapus promo ini?</v-card-text>
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
                { text: "Id Promo", align: "start", sortable: true, value: "id_promo" },
                { text: "Kode Promo", value: "kode_promo" },
                { text: "Jenis Promo", value: "jenis_promo" },
                { text: "Diskon", value: "diskon_promo" },
                { text: "Status", value: "status_promo" },
                { text: "Action", value: "actions" },
            ],
            promo: new FormData(),
            promos: [],
            form: {
                kode_promo: '',
                jenis_promo: '',
                diskon_promo: '',
                status_promo: '',
                keterangan_promo: '',
            },
            deleteId: '',
            editId: '',
            status: [ 'Aktif', 'Tidak Aktif' ],
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

        //Read Data Promo
        readData() {
            var url = this.$api + '/promo';
            this.$http.get(url).then((response) => {
                this.promos = response.data.data;
            });
        },

        //Insert Data Promo
        save(){
            this.promo.append('kode_promo', this.form.kode_promo);
            this.promo.append('jenis_promo', this.form.jenis_promo);
            this.promo.append('diskon_promo', this.form.diskon_promo);
            this.promo.append('status_promo', this.form.status_promo);
            this.promo.append('keterangan_promo', this.form.keterangan_promo);

            var url = this.$api + '/promo';
            this.load = true;
            this.$http.post(url, this.promo, {
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

        //Update Data Promo
        update(){
            var data = new FormData();
            data.append('kode_promo', this.form.kode_promo);
            data.append('jenis_promo', this.form.jenis_promo);
            data.append('diskon_promo', this.form.diskon_promo);
            data.append('status_promo', this.form.status_promo);
            data.append('keterangan_promo', this.form.keterangan_promo);

            var url = this.$api + '/promo/' + this.editId;
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

        //Delete Data Promo
        deleteData(){
            var url = this.$api + "/promo/" + this.deleteId;
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
            this.editId = item.id_promo;
            this.form.kode_promo = item.kode_promo;
            this.form.jenis_promo = item.jenis_promo;
            this.form.diskon_promo = item.diskon_promo;
            this.form.status_promo = item.status_promo;
            this.form.keterangan_promo = item.keterangan_promo;
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
                kode_promo: null,
                jenis_promo: null,
                diskon_promo: null,
                status_promo: null,
                keterangan_promo: null,
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
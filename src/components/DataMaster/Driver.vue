<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Driver</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="drivers" :search="search">
                <template v-slot:[`item.foto`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.foto_driver" height="50px" width="50px" style="object-fit:cover; border-radius:50%; padding: 25px 0;"/>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                    <v-icon dense color="red" @click="deleteHandler(item.id_driver)">mdi-delete</v-icon>
                    <v-icon dense color="primary" dark @click="showImageHandler(item)">mdi-file-multiple</v-icon>
                </template>
                <template v-slot:[`item.bintang_driver`]="{ item }">
                    <v-rating v-model="item.rating_driver" background-color="orange lighten-3" color="orange" label="Rating Driver" medium readonly></v-rating>
                </template>
                <template v-slot:[`item.status_driver`]="{ item }">
                    <v-chip v-if="item.status_driver === 'Tidak Tersedia'" color="red" outlined>{{ item.status_driver }}</v-chip>
                    <v-chip v-if="item.status_driver === 'Tersedia'" color="green" outlined>{{ item.status_driver }}</v-chip>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Driver</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
                        <v-text-field v-model="form.alamat_driver" label="Alamat Driver" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_lahir_driver" label="Tanggal Lahir Driver" required></v-text-field>
                        <v-select v-model="form.jenis_kelamin_driver" label="Jenis Kelamin Driver" :items="jeniskelamin" required></v-select>
                        <v-text-field v-model="form.bahasa_driver" label="Bahasa Driver" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Driver" id="fotoDriver" ref="fileFotoDriver"></v-file-input>
                        <v-text-field v-model="form.notelp_driver" label="Nomor Telepon Driver" required></v-text-field>
                        <v-text-field v-model="form.email_driver" label="Email Driver" required></v-text-field>
                        <v-text-field v-model="form.sewa_harian_driver" label="Sewa Harian Driver" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto SIM Driver" id="simDriver" ref="fileSimDriver"></v-file-input>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Surat Bebas Napza" id="napzaDriver" ref="fileNapzaDriver"></v-file-input>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Surat Kesehatan Jiwa dan Jasmani" id="jasmaniDriver" ref="fileJasmaniDriver"></v-file-input>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Surat Keterangan Catatan Kriminal (SKCK)" id="skckDriver" ref="fileSkckDriver"></v-file-input>
                        <v-select v-model="form.status_driver" label="Status Driver" :items="status" required></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-text-field v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
                        <v-text-field v-model="form.alamat_driver" label="Alamat Driver" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_lahir_driver" label="Tanggal Lahir Driver" required></v-text-field>
                        <v-select v-model="form.jenis_kelamin_driver" label="Jenis Kelamin Driver" :items="jeniskelamin" required></v-select>
                        <v-text-field v-model="form.bahasa_driver" label="Bahasa Driver" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Driver" id="fotoDriver" ref="fileFotoDriver"></v-file-input>
                        <v-text-field v-model="form.notelp_driver" label="Nomor Telepon Driver" required></v-text-field>
                        <v-text-field v-model="form.email_driver" label="Email Driver" required></v-text-field>
                        <v-text-field v-model="form.sewa_harian_driver" label="Sewa Harian Driver" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto SIM Driver" id="simDriver" ref="fileSimDriver"></v-file-input>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Surat Bebas Napza" id="napzaDriver" ref="fileNapzaDriver"></v-file-input>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Surat Kesehatan Jiwa dan Jasmani" id="jasmaniDriver" ref="fileJasmaniDriver"></v-file-input>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Surat Keterangan Catatan Kriminal (SKCK)" id="skckDriver" ref="fileSkckDriver"></v-file-input>
                        <v-select v-model="form.status_driver" label="Status Driver" :items="status" required></v-select>
                        <v-text-field v-model="form.password_driver" label="Password Driver" :type="show ? 'text' : 'password'" 
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show" required></v-text-field>
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
                <v-card-text>Anda Yakin ingin menghapus driver ini?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDokumen" persistent max-width="600px">
            <v-card>
                <v-card-title >
                    <span class="headline">Dokumen Driver</span>
                </v-card-title>
                <span><b>Surat Izin Mengemudi</b></span>
                <v-divider></v-divider>
                <v-container fluid>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <div><v-img width="350px" :src="previewImageUrlSim == '' ? $baseUrl+'/storage/'+form.sim_driver : previewImageUrlSim" id="simDriver" class="mb-5"></v-img></div>
                        </v-flex>
                    </v-layout>
                </v-container>
                
                <span><b>Surat Bebas Napza</b></span>
                <v-divider></v-divider>
                <v-container fluid>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <div><v-img width="350px" :src="previewImageUrlNapza == '' ? $baseUrl+'/storage/'+form.surat_bebas_napza : previewImageUrlNapza" id="napzaDriver" class="mb-5"></v-img></div>
                        </v-flex>
                    </v-layout>
                </v-container>
                
                <span><b>Surat Kesehatan Jiwa dan Jasmani</b></span>
                <v-divider></v-divider>
                <v-container fluid>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <div><v-img width="350px" :src="previewImageUrlJasmani == '' ? $baseUrl+'/storage/'+form.surat_jiwa_jasmani : previewImageUrlJasmani" id="jasmaniDriver" class="mb-5"></v-img></div>
                        </v-flex>
                    </v-layout>
                </v-container>
                
                <span><b>Surat Keterangan Catatan Kriminal</b></span>
                <v-divider></v-divider>
                <v-container fluid>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <div><v-img width="350px" :src="previewImageUrlSkck == '' ? $baseUrl+'/storage/'+form.skck_driver : previewImageUrlSkck" id="skckDriver" class="mb-5"></v-img></div>
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
            inputType: 'Tambah',
            load: false,
            show: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            dialogDokumen: false,
            headers: [
                { text: "ID Driver", align: "start", sortable: true, value: "id_driver", },
                { text: "Nama", value: "nama_driver" },
                { text: "Alamat", value: "alamat_driver" },
                { text: "Tanggal Lahir", value: "tgl_lahir_driver" },
                { text: "Jenis Kelamin", value: "jenis_kelamin_driver" },
                { text: "Bahasa Driver", value: "bahasa_driver" },
                { text: "Nomor Telepon", value: "notelp_driver" },
                { text: "Email", value: "email_driver" },
                { text: "Sewa Harian", value: "sewa_harian_driver" },
                { text: "Status", value: "status_driver" },
                { text: "Rating", value: "rating_driver" },
                { text: "Rating", value: "bintang_driver" },
                { text: "Foto", value: "foto" },
                { text: "Action", value: "actions" },
            ],
            driver: new FormData(),
            drivers: [],
            form: {
                nama_driver: '',
                alamat_driver: '',
                tgl_lahir_driver: '',
                jenis_kelamin_driver: '',
                bahasa_driver: '',
                foto_driver: '',
                notelp_driver: '',
                email_driver: '',
                sewa_harian_driver: '',
                status_driver: '',
                password_driver: '',
            },
            deleteId: '',
            editId: '',
            status: [ 'Tersedia', 'Tidak Tersedia' ],
            jeniskelamin: ['Laki-Laki', 'Perempuan' ],
            previewImageUrlSim : '',
            previewImageUrlNapza : '',
            previewImageUrlJasmani : '',
            previewImageUrlSkck : '',
        };
    },
    methods: {
        onPreviewImage(e) {
            this.previewImageUrlSim = URL.createObjectURL(e);
            this.previewImageUrlNapza = URL.createObjectURL(e);
            this.previewImageUrlJasmani = URL.createObjectURL(e);
            this.previewImageUrlSkck = URL.createObjectURL(e);
        },

        setForm(){
            if (this.inputType !== 'Tambah') {
                this.update();
            } else {
                this.save();
            }
        },

        //Read Data Driver
        readData() {
            var url = this.$api + '/driver';
            this.$http.get(url).then((response) => {
                this.drivers = response.data.data;
            });
        },

        //Insert Data Driver
        save(){
            this.driver.append('nama_driver', this.form.nama_driver);
            this.driver.append('alamat_driver', this.form.alamat_driver);
            this.driver.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
            this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
            this.driver.append('bahasa_driver', this.form.bahasa_driver);

            var foto_driver = document.getElementById('fotoDriver'), dataFotoDriver = foto_driver.files[0];
            this.driver.append('foto_driver', dataFotoDriver);

            this.driver.append('notelp_driver', this.form.notelp_driver);
            this.driver.append('email_driver', this.form.email_driver);
            this.driver.append('sewa_harian_driver', this.form.sewa_harian_driver);
            this.driver.append('status_driver', this.form.status_driver);

            var sim_driver = document.getElementById('simDriver'), dataSimDriver = sim_driver.files[0];
            this.driver.append('sim_driver', dataSimDriver);

            var napza_driver = document.getElementById('napzaDriver'), dataNapzaDriver = napza_driver.files[0];
            this.driver.append('surat_bebas_napza', dataNapzaDriver);
            
            var jasmani_driver = document.getElementById('jasmaniDriver'), dataJasmaniDriver = jasmani_driver.files[0];
            this.driver.append('surat_jiwa_jasmani', dataJasmaniDriver);

            var skck_driver = document.getElementById('skckDriver'), dataSkckDriver = skck_driver.files[0];
            this.driver.append('skck_driver', dataSkckDriver);

            var url = this.$api + '/driver';
            this.load = true;
            this.$http.post(url, this.driver, {
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
            location.reload();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Update Data Driver
        update(){
            var data = new FormData();
            data.append('nama_driver', this.form.nama_driver);
            data.append('alamat_driver', this.form.alamat_driver);
            data.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
            data.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
            data.append('bahasa_driver', this.form.bahasa_driver);

            var inputFotoDriver = document.getElementById('fotoDriver'),
            dataFotoDriver = inputFotoDriver.files[0];

            if(dataFotoDriver){
                data.append('foto_driver', dataFotoDriver);
            }

            data.append('notelp_driver', this.form.notelp_driver);
            data.append('email_driver', this.form.email_driver);
            data.append('sewa_harian_driver', this.form.sewa_harian_driver);
            data.append('status_driver', this.form.status_driver);
            data.append('password_driver', this.form.password_driver ?? '');

            var inputSimDriver = document.getElementById('simDriver'),
            dataSimDriver = inputSimDriver.files[0];

            if(dataSimDriver){
                data.append('sim_driver', dataSimDriver);
            }

            var inputNapzaDriver = document.getElementById('napzaDriver'),
            dataNapzaDriver = inputNapzaDriver.files[0];

            if(dataNapzaDriver){
                data.append('surat_bebas_napza', dataNapzaDriver);
            }

            var inputJasmaniDriver = document.getElementById('jasmaniDriver'),
            dataJasmaniDriver = inputJasmaniDriver.files[0];

            if(dataJasmaniDriver){
                data.append('surat_jiwa_jasmani', dataJasmaniDriver);
            }

            var inputSkckDriver = document.getElementById('skckDriver'),
            dataSkckDriver = inputSkckDriver.files[0];

            if(dataSkckDriver){
                data.append('skck_driver', dataSkckDriver);
            }

            var url = this.$api + '/driver/' + this.editId;
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
            location.reload();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Delete Data Driver
        deleteData(){
            var url = this.$api + "/driver/" + this.deleteId;
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
            this.editId = item.id_driver;
            this.form.nama_driver = item.nama_driver;
            this.form.alamat_driver = item.alamat_driver;
            this.form.tgl_lahir_driver = item.tgl_lahir_driver;
            this.form.jenis_kelamin_driver = item.jenis_kelamin_driver;
            this.form.bahasa_driver = item.bahasa_driver;
            this.form.foto_driver = item.foto_driver;
            this.form.notelp_driver = item.notelp_driver;
            this.form.email_driver = item.email_driver;
            this.form.sewa_harian_driver = item.sewa_harian_driver;
            this.form.status_driver = item.status_driver;
            this.dialog = true;
        },

        showImageHandler(item){
            this.form.sim_driver = item.sim_driver;
            this.form.surat_bebas_napza = item.surat_bebas_napza;
            this.form.surat_jiwa_jasmani = item.surat_jiwa_jasmani;
            this.form.skck_driver = item.skck_driver;
            this.dialogDokumen = true;
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
                nama_driver: '',
                alamat_driver: '',
                tgl_lahir_driver: '',
                jenis_kelamin_driver: '',
                bahasa_driver: '',
                notelp_driver: '',
                email_driver: '',
                sewa_harian_driver: '',
                status_driver: '',
                password_driver: '',
            };
            this.$refs.fileFotoDriver.reset();
            this.$refs.fileSimDriver.reset();
            this.$refs.fileNapzaDriver.reset();
            this.$refs.fileJasmaniDriver.reset();
            this.$refs.fileSkckDriver.reset();

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
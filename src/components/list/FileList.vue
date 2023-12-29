<template>
  <div>
    <v-card>
      <v-table>
        <tbody>
          <tr v-for="(file, index) in files" :key="index">
            <td>{{ file.origName }} ({{ getByteSize(file.size) }})</td>
            <td class="text-right">
              <v-menu v-if="downloadable">
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="plain"
                    icon="mdi-download"
                    size="medium"
                    v-bind="props"
                    @click="downloadFile(file)"
                  ></v-btn>
                </template>
              </v-menu>
              <v-menu v-if="deletable">
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="plain"
                    icon="mdi-close-circle-outline"
                    size="medium"
                    v-bind="props"
                    @click="clickDeleteBtn(file)"
                  ></v-btn>
                </template>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  name: "FileList",
  props: {
    files: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    downloadable: {
      type: Boolean,
      required: false,
      default: false,
    },
    deletable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["delete"],
  setup(props, { emit }) {
    const axios = inject("axios");
    const downloadFile = file => {
      axios
        .get(`/files/${file.id}/download`, { responseType: "blob" })
        .then(res => {
          const fileName =
            res.headers["content-disposition"].split("filename=")[1];
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", decodeURI(fileName));
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch(e => {
          console.log(e);
          alert("다운로드가 실패했습니다. 잠시 후 다시 시도해주세요.");
        });
    };

    const clickDeleteBtn = file => {
      emit("delete", file);
    };

    const getByteSize = size => {
      const byteUnits = ["KB", "MB", "GB", "TB"];
      for (let i = 0; i < byteUnits.length; i++) {
        size = size / 1024;
        if (size < 1024) {
          return size.toFixed(1) + byteUnits[i];
        }
      }
    };

    return { downloadFile, clickDeleteBtn, getByteSize };
  },
};
</script>

<style scoped></style>

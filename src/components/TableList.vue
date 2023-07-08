<template>
  <div>
    <div class="data__table">
      <Table
        :pagination="false"
        size="small"
        v-if="list.length"
        :data-source="dataSource ?? dataSourceSorted"
        :columns="columns"
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'name'">
            <span style="cursor: pointer" @click="handleReverse">
              {{ column.title }}
            </span>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
                <div class="tablecell_name">
                <span style="cursor: pointer;" @click="onCopyToClipboard(record.link)">{{ record.name }}</span>
                </div>
            </template>
          <template v-if="column.dataIndex === 'link'">
            <a class="data__table-link" @click="handleDownload(record.link)">
              Скачать
            </a>
          </template>
        </template>
      </Table>
    </div>
  </div>
</template>
<script>
import { Table, Image } from 'ant-design-vue';
import { ref } from '@vue/reactivity';
import { computed } from '@vue/reactivity';
export default {
  components: { Table, Image },
  props: {
    list: { type: Array, required: true },
  },
  emits: ['handleDownload','handleCopyToClipboard'],
  setup(props, { emit }) {
    const isReverse = ref(false);
    const dataSourceSorted = ref(false);
      const dataSource = computed(() => {
        console.log(props.list)
      return dataSourceSorted.value
        ? props.list
            .map((el) => {
              return {
                key: el.metadata.md5,
                name: el.metadata.name,
                  uploadtime: el.metadata.uploadTime,
                  filesize: `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(el.length / 1024 / 1024)} Мб`,
                  size: el.length / 1024 / 1024,
                upload: new Date(
                  el.metadata.uploadTime * 1000,
                ).toLocaleDateString(),
                type: el.metadata.mimetype,
                link: `${el.filename},${el.metadata.name}`,
              };
            })
            .sort(function (a, b) {
              if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
              }
              if (b.name.toLowerCase() > a.name.toLowerCase()) {
                return -1;
              }
              return 0;
            })
        : props.list.map((el) => {
            return {
              key: el.metadata.md5,
              name: el.metadata.name,
                uploadtime: el.metadata.uploadTime,
                filesize: `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(el.length / 1024 / 1024)} Мб`,
              size: el.length / 1024 / 1024,
              upload: new Date(
                el.metadata.uploadTime * 1000,
              ).toLocaleDateString(),
              type: el.metadata.mimetype,
              link: `${el.filename},${el.metadata.name}`,
            };
          });
    });
    const columns = [
      { title: 'Имя файла', dataIndex: 'name', align: 'center' },
      {
        title: 'Дата загрузки',
        dataIndex: 'upload',
        align: 'center',
        sorter: (a, b) => b.uploadtime - a.uploadtime,
      },
      { title: 'Тип', dataIndex: 'type', align: 'center' },
      { title: 'Размер', dataIndex: 'filesize', align: 'center', sorter: (a, b) => b.size - a.size },
      { title: 'Ссылка на скачивание', dataIndex: 'link', align: 'center' },
    ];
      const onCopyToClipboard = (link) => {
          const [filename, name] = link.split(',');
          emit('handleCopyToClipboard', { filename, name });
    }
    const handleDownload = (file) => {
      const [filename, name] = file.split(',');
      emit('handleDownload', { filename, name });
    };
    const handleReverse = () => {
      dataSourceSorted.value = !dataSourceSorted.value;
    };
    return { dataSource, columns, handleDownload, isReverse, handleReverse, onCopyToClipboard };
  },
};
</script>

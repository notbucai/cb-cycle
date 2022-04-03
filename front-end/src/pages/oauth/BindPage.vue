<template>
  <div>bind loading</div>
</template>

<script lang="tsx" setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { oauthBind } from '../../api/common';
const router = useRouter()
const route = useRoute()

const type = (route.params.type || 'github') as string;
const code = (route.query.code || '') as string;

console.log(type, code);

onMounted(async () => {
  const data = await oauthBind({
     code,
     type
  });
  console.log('data', data);
  router.replace('/manage/task/create')
});

</script>
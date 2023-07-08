import { message } from 'ant-design-vue';

export async function postRequestToRegOrLogin(body, routPath) {
  const response = await fetch(
    `${process.env.VUE_APP_API_URL}/auth/${routPath}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      data.errors.map(({ msg }) => message.error(msg));
      return false;
    }
    message.error(data.message);
    return false;
  }
  message.success(data.message);
  return data;
}

export async function fetchingGallery(user, token) {
  const response = await fetch(
    `${process.env.VUE_APP_API_URL}/user/${user}/gallery`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      data.errors.map(({ msg }) => message.error(msg));
      return;
    }
    message.error(data.message);
    return;
  }
  message.success('Галерея полизователя загружена');
  return Array.isArray(data) ? data : [];
}
// export async function uploadImage(user, formData, token) {
//   const response = await fetch(
//     `${process.env.VUE_APP_API_URL}/user/${user}/upload`,
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     },
//   );
//   const data = await response.json();
//   if (!response.ok) {
//     if (data.errors) {
//       data.errors.map(({ msg }) => message.error(msg));
//       return;
//     }
//     message.error(data.message);
//     return;
//   }
//   message.success('Галерея полизователя обновлена');
//   return data.file;
// }
export async function removeImage(user, filename, token) {
  const body = {
    filename,
  };
  const response = await fetch(
    `${process.env.VUE_APP_API_URL}/user/${user}/remove`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.errors) {
      data.errors.map(({ msg }) => message.error(msg));
      return;
    }
    message.error(data.message);
    return;
  }
  message.success('Галерея полизователя обновлена');
}
export async function downloadImage(name, filename) {
  window.open(
    process.env.VUE_APP_API_URL + '/storage/download/' + filename + '/' + name,
    '_blanc',
  );
  message.success('Отправлен запрос на скачивание файла');
}

import { authStore } from '@/store';
import dialogOpen from '@/streams/Actions/dialogOpen';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

export default async function withAuth(options, action) {
  if (!options.needAuth) {
    return;
  }

  await authStore.defineAuthStatus();

  if (authStore.isLogin) {
    authChannel.put(Answer.createOk());
    return;
  }

  dialogOpen('auth');
  const res = await authChannel.take();
  if (res.status === false) {
    action.end();
    action.req.answer(res);
  }
}

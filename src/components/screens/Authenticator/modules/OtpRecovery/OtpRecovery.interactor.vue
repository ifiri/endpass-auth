<template>
  <otp-recovery
    v-bind="$attrs"
    :is-loading="isLoading"
    :error="error"
    :is-phone-exist="isPhoneExist"
    @submit="onSubmit"
    @cancel="onCancel"
    @send-code="sendCode"
  />
</template>

<script>
import OtpRecovery from '@/components/modules/OtpRecovery';
import { authStore } from '@/store';
import createRecoverController from './RecoverController';

export default {
  name: 'OtpRecoveryInteractor',

  authStore,
  recoverController: createRecoverController(),

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isPhoneExist: true,
    isLoading: false,
    error: '',
  }),

  methods: {
    async sendCode() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';
        const { email } = this;

        await this.$options.recoverController.sendSms({ email });
      } catch (error) {
        if (error.code === 400) {
          this.isPhoneExist = false;
          return;
        }

        this.error = this.$i18n.t('components.recoverOtpSms.sendSmsError');
      } finally {
        this.isLoading = false;
      }
    },

    async onSubmit({ code }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        const { email } = this;

        await this.$options.recoverController.disableOtp({
          email,
          code,
        });

        this.$emit('otp-recovered');
      } catch (err) {
        this.error = this.$i18n.t('components.recoverOtpSms.recoverError');
      } finally {
        this.isLoading = false;
      }
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  mounted() {
    this.sendCode();
  },

  components: {
    OtpRecovery,
  },
};
</script>

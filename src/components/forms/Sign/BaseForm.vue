<template>
  <div data-test="sign-form">
    <form-field v-if="error">
      <message
        :error="true"
        data-test="base-form-error"
      >
        {{ error }}
      </message>
    </form-field>
    <form-field v-if="requesterUrl">
      <v-link
        :href="requesterUrl"
        data-test="requester-url"
        target="_blank"
        is-underline
      >
        {{ requesterUrl }}
      </v-link>
      {{ $t('components.sign.requestSign') }}
    </form-field>
    <form-field :label="title">
      <v-address
        :address="account"
        data-test="account-address"
      />
    </form-field>
    <form-field :label="$t('components.sign.yourPass')">
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        :placeholder="$t('components.sign.enterPass')"
        :error="errors.first('password')"
        :data-vv-as="$t('components.sign.passwordField')"
        name="password"
        type="password"
        required
        data-test="password-input"
      />
    </form-field>
    <slot />
    <form-controls>
      <v-button
        :disabled="!isClosable || isLoading"
        skin="quaternary"
        type="button"
        data-test="cancel-button"
        @click="emitCancel"
      >
        {{ $t('global.close') }}
      </v-button>
      <v-button
        :disabled="isLoading || !isFormValid"
        :is-loading="isLoading"
        type="button"
        data-test="submit-button"
        @click="emitSubmit"
      >
        {{ $t('global.sign') }}
      </v-button>
    </form-controls>
  </div>
</template>

<script>
import get from 'lodash/get';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VLink from '@endpass/ui/kit/VLink';
import signer from '@/class/singleton/signer';
import Message from '@/components/common/Message.vue';
import VAddress from '@/components/common/VAddress.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import { accountsStore } from '@/store';

export default {
  name: 'SignBaseForm',

  inject: ['$validator'],

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },

    request: {
      type: Object,
      default: null,
    },

    isClosable: {
      type: Boolean,
      default: true,
    },

    title: {
      type: String,
      default: null,
    },

    isFormValid: {
      type: Boolean,
      default: false,
    },
  },

  accountsStore,

  data: () => ({
    password: '',
  }),

  computed: {
    account() {
      return get(this.request, 'address');
    },

    network() {
      return get(this.request, 'net');
    },

    requesterUrl() {
      return get(this.request, 'url');
    },
  },

  watch: {
    password() {
      if (this.errors.firstById('incorrectPassword')) {
        this.errors.removeById('incorrectPassword');
      }
    },
  },

  methods: {
    async emitSubmit() {
      if (!this.isFormValid) return;

      try {
        await this.$options.accountsStore.validatePassword({
          address: this.account,
          password: this.password,
        });
        this.$emit('submit', {
          account: this.account,
          password: this.password,
        });
      } catch (err) {
        this.errors.add({
          id: 'incorrectPassword',
          field: 'password',
          msg: err.message,
        });
      }
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  async mounted() {
    this.$validator.resume();
    await signer.setWeb3Network(this.network);
  },

  beforeDestroy() {
    this.$validator.pause();
  },

  components: {
    VLink,
    VButton,
    VInput,
    Message,
    FormField,
    FormControls,
    VAddress,
  },
};
</script>

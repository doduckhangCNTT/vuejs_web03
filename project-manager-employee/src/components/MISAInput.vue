<script>
export default {
  name: "MISAInput",
  props: {
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {};
  },
};
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    ref="refInput"
    class="textfield__input input-hover input-focus"
    type="text"
    @blur="validateInput"
  />
</template>

<style lang="scss" scoped></style>

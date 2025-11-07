<template>
  <div class="form-group">
    <label v-if="label" :for="id">
      <span v-if="icon" class="icon">{{ icon }}</span>
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="form-input"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  icon?: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  modelValue: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 10px;
}

.form-group .icon {
  font-size: 20px;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 16px;
  transition: all 0.3s;
  font-family: 'Noto Sans KR', sans-serif;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.form-input::placeholder {
  color: #64748b;
}
</style>

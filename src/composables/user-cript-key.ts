const cryptKey = 'cryptKey'

export function useUserCryptKey() {
  return useSessionStorage<Uint8Array<ArrayBuffer> | null>(cryptKey, null, {
    serializer: {
      read: (raw: string) => (raw ? fromBase64(raw) : null),
      write: (value: Uint8Array<ArrayBuffer> | null) => (value ? toBase64(value) : ''),
    },
  })
}

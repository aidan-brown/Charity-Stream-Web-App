export default async function sleep (ms: number, callback: () => Promise<void>): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
  await callback()
}

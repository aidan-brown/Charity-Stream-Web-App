export default async function sleep (ms: number, callback: () => void): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
  callback()
}

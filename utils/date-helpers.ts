export const convertExpiryToDate = (expiresIn: number): Date => {
    const date = new Date(Date.now() + (expiresIn * 1000))
    return date
}

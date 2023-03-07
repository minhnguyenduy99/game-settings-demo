export const extractFileName = (fileName: string, ext?: string) => {
	if (ext) {
		const extIndex = fileName.indexOf(ext)
		if (extIndex === -1) {
			return fileName
		}
		return fileName.substring(0, extIndex)
	}
	const parts = fileName.split('.').filter((part) => !!part)
	// remove last part of file name. Eg: setting.1201.xlsx => setting.1201
	parts.pop()
	return parts.join('.')
}

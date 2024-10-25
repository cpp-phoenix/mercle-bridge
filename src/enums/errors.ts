import { t } from 'elysia'

const error = t.Enum({
    SOMETHING_WENT_WRONG: 500,
    SUCCESS: 200
});

type Error = typeof error.static

export { error, Error }
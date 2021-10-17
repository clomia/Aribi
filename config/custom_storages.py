from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorage(S3Boto3Storage):
    pass


class UploadStorage(S3Boto3Storage):
    pass

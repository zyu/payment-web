import bcrypt

# 原始哈希值
original_hash = "$2y$12$SG1rKbACXCE9cA8g9hBTeO/pQm.OaKPnuuQNPCL5hchYxP.r9v2Kq"
# 尝试的密码
password = "asdm31ind1d223"


new_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print("新密码哈希值:", new_password)

# 方法1：直接使用 $2y$ 格式（某些库支持）
try:
    if bcrypt.checkpw(password.encode('utf-8'), original_hash.encode('utf-8')):
        print("密码匹配！")
    else:
        print("密码不匹配！")
except Exception as e:
    print("错误:", e)

# 方法2：替换 $2y$ -> $2a$（兼容性处理）
adjusted_hash = original_hash.replace('$2y$', '$2a$')
if bcrypt.checkpw(password.encode('utf-8'), adjusted_hash.encode('utf-8')):
    print("密码匹配！（调整后）")
else:
    print("密码不匹配！（调整后）")
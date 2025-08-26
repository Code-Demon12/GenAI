import os

def print_tree(startpath, indent=''):
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        if level == 0:
            print(os.path.basename(root) + '/')
        else:
            print('    ' * level + os.path.basename(root) + '/')
        for f in files:
            print('    ' * (level + 1) + f)

print_tree('.')

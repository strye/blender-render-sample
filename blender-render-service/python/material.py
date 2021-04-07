import bpy

ob = bpy.context.active_object

# Get material
mat = bpy.data.materials.get("Material")
if mat is None:
    # create material
    mat = bpy.data.materials.new(name="Material")

# Assign it to object
if ob.data.materials:
    # assign to 1st material slot
    ob.data.materials[0] = mat
else:
    # no slots
    ob.data.materials.append(mat)

# Setup the materials and material variables
# frontMat = bpy.data.materials.get("Front")
# topMat = bpy.data.materials.get("Top")
# rightMat = bpy.data.materials.get("Top")
# leftMat = bpy.data.materials.get("Top")
# backMat = bpy.data.materials.get("Top")
# bottomMat = bpy.data.materials.get("Top")

# front = 0
# top = 1
# right = 2
# left = 3
# back = 4
# bottom = 5

# ob.data.materials[front] = mat
# ob.data.materials[top] = frontMat
# ob.data.materials[right] = mat
# ob.data.materials[left] = mat
# ob.data.materials[back] = mat
# ob.data.materials[bottom] = mat

import bpy
import json

# bpy.ops.wm.open_mainfile(filepath="../SimpleSample.blend")

ob = bpy.data.objects['Cube'] # bpy.context.active_object

# Opening JSON files and return JSON object as a dictionary
f = open('./working/params.json',)
data = json.load(f)
m = open('./working/modelMeta.json',)
metadata = json.load(m)

# Iterating through the json list
for i in data['designs']:
    part = i['part']
    mat = bpy.data.materials.get(i['material'])
    materialZone = metadata['materialMap'][part]
    slot = materialZone['slot']
    ob = bpy.data.objects[materialZone['meshName']]
    ob.data.materials[slot] = mat
    # print('output: '+part+'-'+i['material'])

# Closing file
f.close()


for i in metadata['cameras']:
    cam = bpy.context.scene.objects[i['cameraName']]
    bpy.context.scene.camera = cam
    bpy.context.scene.render.filepath = './working/'+i['imageName']
    bpy.context.scene.render.resolution_x = i['width'] #perhaps set resolution in code
    bpy.context.scene.render.resolution_y = i['height']
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.ops.render.render(write_still = True)


m.close()


# bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
# bpy.ops.wm.save_as_mainfile(filepath="./SimpleSample.blend")
# bpy.ops.wm.quit_blender()
# Blender Render Sample

This project offers an example of wrapping blender in a service to offload rendering. It is based on a progressive-eventually-consistent rendering model, where lical images of a scene are rendered locally as place holders while the scene is sent off to a render server where blender can generate higher resolution images.



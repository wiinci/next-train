<script id="stubs" type="text/x-jquery-tmpl">
<div class="stub-{{=route}}">
  <p class="title allcaps misobold">{{=route}}line Train</p>
  <div class="row">
    <div class="start allcaps league five columns">
      <p>{{=from}}</p>
    </div>
    <div class="to league two columns"><p></p></div>
    <div class="end allcaps league five columns">
      <p>{{=to}}</p>
    </div>
  </div>
</div>
<div class="stub-bottom">
  <p class="title allcaps misobold">Arriving In</p>
  <div class="row">
    <div class="time league">
      <p>{{=mins}} <span>Minutes</span></p>
      <p>{{=secs}} <span>Seconds</span></p>
    </div>
  </div>
</div>
</script>
<script type="text/javascript">
  $('#stublist').html(
    $('#stubs').render(meta)
  );
</script>

<div class="stub-blue">
  <p class="title allcaps misobold">Goldline Train</p>
  <div class="row">
    <div class="start allcaps league five columns">
      <p>Folsom Blvd & Iron Point Rd</p>
    </div>
    <div class="to league two columns"><p></p></div>
    <div class="end allcaps league five columns">
      <p>Sacramento Valley Station</p>
    </div>
  </div>
</div><!-- /.stub-middle -->
<div class="stub-bottom">
  <p class="title allcaps misobold">Arriving In</p>
  <ul class="time league clearfix">
    <li>10 <span>Minutes</span></li>
    <li>20 <span>Seconds</span></li>
  </ul>
</div><!-- /.stub-bottom -->

  <script id="stubs" type="text/x-jquery-tmpl">
    <div class="stub-{{=route}}">
      <p class="title allcaps misobold">{{=route}}line Train To</p>
        <div class="end allcaps league">
          <p>{{=to}}</p>
        </div>
    </div>
    <div class="stub-bottom">
      <p class="title allcaps misobold">Arriving At <span>{{=eta}}</span> In</p>
      <ul class="time league clearfix">
        <li>{{=mins}} <span>Minutes</span></li>
        <li>{{=secs}} <span>Seconds</span></li>
      </ul>
    </div>
  </script>